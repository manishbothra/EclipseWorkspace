DROP MATERIALIZED VIEW IF EXISTS "company_address_view";
DROP MATERIALIZED VIEW IF EXISTS "company_services_view";
DROP MATERIALIZED VIEW IF EXISTS "company_products_view";
DROP MATERIALIZED VIEW IF EXISTS "company_products_result_view";
DROP MATERIALIZED VIEW IF EXISTS "trade_stats_view";
drop MATERIALIZED view IF EXISTS "trade_stats_port_recent_view";
DROP AGGREGATE IF EXISTS textcat_all(text);

---------------------------------------------------------------
CREATE MATERIALIZED VIEW company_address_view AS 
 SELECT DISTINCT dense_rank() OVER (ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS row_id,
    dense_rank() OVER (PARTITION BY tp.type_value ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS ownership_row_id,
    dense_rank() OVER (PARTITION BY addr.city ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS city_row_id,
    dense_rank() OVER (PARTITION BY c.company_status ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS status_row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    cf.annual_turnover,
    c.country,
    c.registrant,
    c.category,
    c.sub_category,
    c.company_status,
    tp.type_value AS ownership,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    cf.year AS financial_year,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    addr.address_id,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info
   FROM company c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
  ORDER BY c.year_of_establishment
WITH DATA;

CREATE INDEX company_address_view_country_idx ON company_address_view USING gin (country gin_trgm_ops);
CREATE INDEX company_address_view_company_idx ON company_address_view USING gin (company_name gin_trgm_ops)
CREATE INDEX company_address_view_country_name_idx ON company_address_view USING gin (country gin_trgm_ops, company_name gin_trgm_ops)

------------------------------------------------------------------------------------

CREATE MATERIALIZED VIEW company_products_view AS 
 SELECT DISTINCT c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    c.country,
    c.ownership,
    c.annual_turnover,
    c.assets,
    c.liabilities,
    c.net_worth,
    cp.product_name,
    cp.trade_duration,
    cp.trade_category_type_id,
    cp.product_id,
    cp.product_keywords
   FROM company_address_view c
     JOIN company_products cp ON c.company_id = cp.company_id
WITH DATA;

CREATE INDEX company_products_view_product_id_idx ON company_products_view USING btree (product_id);
CREATE INDEX company_products_view_country_idx ON company_products_view USING btree (country);

------------------------------------------------------------------------------------

DROP MATERIALIZED VIEW company_products_result_view;

CREATE MATERIALIZED VIEW company_products_result_view AS 
 SELECT DISTINCT c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    c.country,
    c.ownership,
    c.annual_turnover,
    c.assets,
    c.liabilities,
    c.net_worth,
    c.authorised_capital,
    c.paid_up_capital,
    array_to_string(array_agg(DISTINCT pr.product_name), ','::text) AS product_name,
    cp.trade_category_type_id,
    array_agg(DISTINCT cp.product_id) AS product_id,
    array_to_string(array_agg(DISTINCT cp.product_keywords), ','::text) AS product_keywords,
    array_to_string(array_agg(DISTINCT cp.trade_duration), ','::text) AS trade_duration,
    c.city,
    c.state,
    c.pincode,
    c.address_line_1,
    c.address_line_2,
    c.address_line_3,
    c.coordinates,
    c.contacts,
    c.extra_info
   FROM company_address_view c
     JOIN company_products cp ON c.company_id = cp.company_id
     JOIN product pr ON cp.product_id = pr.product_id
  GROUP BY c.company_id, c.company_name, c.office_size, c.company_sic, c.year_of_establishment, c.registration_number, c.country, c.ownership, cp.trade_category_type_id, c.annual_turnover, c.assets, c.liabilities, c.net_worth, c.authorised_capital, c.paid_up_capital, c.city, c.state, c.pincode, c.address_line_1, c.address_line_2, c.address_line_3, c.coordinates, c.contacts, c.extra_info
WITH DATA;

CREATE INDEX company_products_result_view_company_id_idx ON company_products_result_view USING btree (company_id);
CREATE INDEX company_products_result_view_prod_idx ON company_products_result_view USING gin (product_name gin_trgm_ops);
CREATE INDEX company_products_result_view_prod_country_idx ON company_products_result_view USING gin (product_name gin_trgm_ops, country gin_trgm_ops);


-------------------------------------------------------------------------------------

CREATE MATERIALIZED VIEW company_services_view AS 
 SELECT DISTINCT c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    cf.annual_turnover,
    c.registration_number,
    c.country,
    tp.type_value AS ownership,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    array_to_string(array_agg(DISTINCT ic.product_name), ', '::text) AS product_name,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    c.extra_info
   FROM company c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
     JOIN industry_classification ic ON ic.product_code::text = c.company_sic
  WHERE (ic.product_code / 100) > 33
  GROUP BY c.company_id, c.company_name, c.office_size, c.company_sic, c.year_of_establishment, cf.annual_turnover, c.registration_number, c.country, tp.type_value, cf.assets, cf.liabilities, cf.net_worth, cf.authorised_capital, cf.paid_up_capital, addr.city, addr.state, addr.pincode, addr.address_line_1, addr.address_line_2, addr.address_line_3, addr.coordinates, c.extra_info
UNION
 SELECT DISTINCT cp.company_id,
    cp.company_name,
    cp.office_size,
    cp.company_sic,
    cp.year_of_establishment,
    cp.annual_turnover,
    cp.registration_number,
    cp.country,
    cp.ownership,
    cp.assets,
    cp.liabilities,
    cp.net_worth,
    cp.authorised_capital,
    cp.paid_up_capital,
    cp.product_name,
    cp.city,
    cp.state,
    cp.pincode,
    cp.address_line_1,
    cp.address_line_2,
    cp.address_line_3,
    cp.coordinates,
    cp.extra_info
   FROM company_products_result_view cp
  WHERE cp.extra_info ~~* '%local:yp:%'::text
  ORDER BY 9, 5
WITH DATA;

CREATE INDEX company_services_view_country ON company_services_view USING gin(country gin_trgm_ops);
CREATE INDEX company_services_view_prod_name ON company_services_view USING gin(product_name gin_trgm_ops);

-------------------------------------------------------------------------------------
CREATE MATERIALIZED VIEW "trade_stats_view" AS
select row_number() OVER() AS "id", trade_category_type_id, product_code as parent_code, level3code, level2code, 
parent_name,level2name,level3name,
quantity,value,source_location_id,target_location_id,source_region_id,source_location_name
,source_region_name,to_date(trade_date, 'MM/DD/YYYY') as trade_date
from ( select p.product_code as code,sum(quantity) as quantity,sum(value) as value, 
t.trade_category_type_id,t.source_location_id, t.target_location_id, l.region_id as source_region_id,
l.country as source_location_name,trade_date, r.region_name as source_region_name
from location l,trade t,product p,region r 
where t.source_location_id=l.location_id And p.product_id=t.product_id and t.origin_port is null
and l.region_id = r.region_id
group by p.product_code, trade_category_type_id, t.source_location_id, t.target_location_id, source_region_id,
source_location_name,trade_date,source_region_name )a 
join (select p.product_code,p.product_name as parent_name, q.product_name as level2name,
r.product_name as level3name,r.product_code as level3code, q.product_code as level2code 
from product p,product q,product r  
where r.parent_id=q.product_code 
And q.parent_id=p.product_code order by p.product_code) b on a.code=b.level3code 
group by trade_category_type_id, parent_name,level2name,level3name,product_code 
,quantity,value,level3code, level2code, source_location_id, target_location_id, source_region_id,source_location_name,trade_date,
source_region_name
order by product_code
WITH DATA;

CREATE INDEX trade_stats_index_1 ON trade_stats_view (trade_category_type_id, target_location_id, trade_date);

-----------------------------------------------------------------

DROP MATERIALIZED VIEW IF EXISTS "trade_stats_port_view";

CREATE MATERIALIZED VIEW "trade_stats_port_view" AS
select row_number() OVER() AS "id",trade_category_type_id, CAST(p.product_code AS text ) as product_code, p.product_name as description,
sum(quantity) as quantity, sum(value) as value,source_location_id,target_location_id,
to_date(trade_date, 'MM/DD/YYYY') as trade_date,
to_char(to_date(tr.trade_date::text, 'MM/DD/YYYY'::text), 'Mon-YYYY'::text) AS trade_month,
origin_port,destination_port
from trade tr join product p on tr.product_id = p.product_id where origin_port is not null and destination_port not ilike 'India' 
group by trade_category_type_id, p.product_code, p.product_name, tr.source_location_id, tr.target_location_id,origin_port,destination_port, trade_date
WITH DATA;
CREATE INDEX trade_stats_port_view_index_1 ON trade_stats_port_view (trade_category_type_id, origin_port, trade_date,product_code);
CREATE INDEX trade_stats_port_view_desc ON trade_stats_port_view USING gin(DESCRIPTION gin_trgm_ops);
CREATE INDEX trade_stats_port_view_index_2 ON trade_stats_port_view (origin_port);
CREATE INDEX trade_stats_port_view_month_desc_idx_1 ON trade_stats_port_view USING gin (trade_category_type_id, trade_month, description);
CREATE INDEX trade_stats_port_view_month_idx_1 ON trade_stats_port_view USING gin (trade_month);

-----------------------------------------------------------------
create materialized view COMPANY_DIRECTORY_STATS_VIEW as
SELECT DISTINCT  country, registrant,ownership_type_id,company_status,
count(registrant) OVER (PARTITION BY registrant) AS registrantCount,
count(ownership_type_id) OVER (PARTITION BY ownership_type_id) AS ownershipCount,
count(company_status) OVER (PARTITION BY company_status) AS statusCount 
FROM company order by country
with data;

CREATE INDEX COMPANY_DIRECTORY_STATS_VIEW_COUNTRY_INDX ON COMPANY_DIRECTORY_STATS_VIEW USING gin(COUNTRY gin_trgm_ops);
-----------------------------------------------------------------

CREATE MATERIALIZED VIEW product_master_data_view AS 
 SELECT DISTINCT 0 as product_code,
    product_name,
    product_description, extra_info
   FROM product1 where (extra_info is not null or extra_info not ilike '') UNION 
 SELECT DISTINCT COALESCE( product_code, 0 ),
    lower(product_name),
    product_description,extra_info
   FROM product2 where (extra_info is not null or extra_info not ilike '') UNION
SELECT DISTINCT COALESCE( product_code, 0 ),
    product_name,
    product_description, extra_info
   FROM product where (product_code is null or product_code = 0) and (extra_info is not null or extra_info not ilike '')
    
WITH DATA;

-------------------------------------------------------------------

CREATE MATERIALIZED VIEW trade_stats_port_recent_view AS 
 SELECT row_number() OVER () AS id,
    tr.trade_category_type_id,
    p.product_code::text AS product_code,
    p.product_name AS description,
    sum(tr.quantity) AS quantity,
    sum(tr.value) AS value,
    tr.source_location_id,
    tr.target_location_id,
    to_date(tr.trade_date::text, 'MM/DD/YYYY'::text) AS trade_date,
    to_char(to_date(tr.trade_date::text, 'MM/DD/YYYY'::text)::timestamp with time zone, 'Mon-YYYY'::text) AS trade_month,
    tr.origin_port,
    tr.destination_port
   FROM trade tr
     JOIN product p ON tr.product_id = p.product_id
  WHERE tr.origin_port IS NOT NULL AND tr.destination_port::text !~~* 'India'::text AND date_part('month'::text, to_date(tr.trade_date::text, 'MM/DD/YYYY'::text)) = date_part('month'::text, 'now'::text::date) OR date_part('month'::text, to_date(tr.trade_date::text, 'MM/DD/YYYY'::text)) = date_part('month'::text, 'now'::text::date - '1 mon'::interval)
  GROUP BY tr.trade_category_type_id, p.product_code, p.product_name, tr.source_location_id, tr.target_location_id, tr.origin_port, tr.destination_port, tr.trade_date
WITH DATA;

CREATE UNIQUE INDEX trade_stats_port_recent_view_uniq ON trade_stats_port_recent_view USING btree (id);
CREATE INDEX trade_stats_port_recent_view_product_code_idx ON trade_stats_port_recent_view USING gin (product_code gin_trgm_ops);
CREATE INDEX trade_stats_port_recent_view_dport_idx_gin ON trade_stats_port_recent_view USING gin (destination_port gin_trgm_ops);
CREATE INDEX trade_stats_port_recent_view_oport_idx_gin ON trade_stats_port_recent_view USING gin (origin_port gin_trgm_ops);
CREATE INDEX trade_stats_port_recent_view_oport_idx_test ON trade_stats_port_recent_view (trade_date);
CREATE INDEX trade_stats_port_recent_view_month_desc_idx_1 ON trade_stats_port_recent_view USING gin (trade_category_type_id, trade_month, description);
CREATE INDEX trade_stats_port_recent_view_month_idx_1 ON trade_stats_port_recent_view USING gin (trade_month);
-------------------------------------------------------------------

CREATE MATERIALIZED VIEW company_products_result_overseas_view AS 
 SELECT DISTINCT row_number() OVER () AS row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    c.country,
    c.ownership,
    c.annual_turnover,
    c.assets,
    c.liabilities,
    c.net_worth,
    c.authorised_capital,
    c.paid_up_capital,
    pr.product_name,
    cp.trade_category_type_id,
    pr.product_id,
    array_to_string(array_agg(DISTINCT cp.product_keywords), ','::text) AS product_keywords,
    array_to_string(array_agg(cp.trade_duration), ','::text ) AS trade_duration,
    c.city,
    c.state,
    c.pincode,
    c.address_line_1,
    c.address_line_2,
    c.address_line_3,
    c.coordinates,
    c.contacts,
    c.extra_info
   FROM company_address_view c
     JOIN company_products cp ON c.company_id = cp.company_id
     JOIN product pr ON cp.product_id = pr.product_id
   WHERE c.country not ilike 'India'
  GROUP BY c.company_id, c.company_name, pr.product_id, pr.product_name, c.office_size, c.company_sic, c.year_of_establishment, c.registration_number, c.country, c.ownership, cp.trade_category_type_id, c.annual_turnover, c.assets, c.liabilities, c.net_worth, c.authorised_capital, c.paid_up_capital, c.city, c.state, c.pincode, c.address_line_1, c.address_line_2, c.address_line_3, c.coordinates, c.contacts, c.extra_info
WITH DATA;

CREATE INDEX company_products_result_overseas_view_company_id_idx ON company_products_result_overseas_view USING btree (company_id);
CREATE INDEX company_products_result_overseas_view_prod_country_type_idx ON company_products_result_overseas_view USING gin (trade_category_type_id, product_name gin_trgm_ops, country gin_trgm_ops);
CREATE INDEX company_products_result_overseas_view_prod_country_idx ON company_products_result_overseas_view USING gin (product_name gin_trgm_ops, country gin_trgm_ops);
CREATE INDEX company_products_result_overseas_view_prod_idx ON company_products_result_overseas_view USING gin (product_name gin_trgm_ops);
CREATE UNIQUE INDEX company_products_result_overseas_view_uniq_idx ON company_products_result_overseas_view USING btree (row_id);
CREATE INDEX company_products_result_overseas_view_prod_export_idx ON company_products_result_overseas_view USING gin (trade_category_type_id, product_name gin_trgm_ops) where trade_category_type_id in ( 24,36 );

----------------------------------------------------------------------------------------------------------------------------------

CREATE MATERIALIZED VIEW public.company_products_result_india_view
TABLESPACE pg_default
AS
 SELECT DISTINCT row_number() OVER () AS row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.company_short_description,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    c.country,
    tp.type_value AS ownership,
    cf.annual_turnover,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    pr.product_name,
    cp.trade_category_type_id,
    pr.product_id,
    pr.product_code::text AS product_code,
	array_to_string((array_agg(pr.product_name) OVER ( PARTITION BY c.company_id))[1:6], ', ')  as combined_products,
    array_to_string(array_agg(DISTINCT cp.product_keywords), ','::text) AS product_keywords,
    array_to_string(array_agg(cp.trade_duration), ','::text) AS trade_duration,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info,
    tradehistory.shipment_count
   FROM company c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
     LEFT JOIN ( SELECT th.company_id,
            count(th.company_id) AS shipment_count
           FROM trade_history th
          GROUP BY th.company_id) tradehistory ON tradehistory.company_id = c.company_id
     JOIN company_products cp ON c.company_id = cp.company_id
     JOIN product pr ON cp.product_id = pr.product_id
  WHERE c.country::text ~~* 'India'::text
  GROUP BY c.company_id, c.company_name, c.company_short_description, pr.product_id, pr.product_code, pr.product_name, c.office_size, c.company_sic, c.year_of_establishment, c.registration_number, c.country, tp.type_value, cp.trade_category_type_id, cf.annual_turnover, cf.assets, cf.liabilities, cf.net_worth, cf.authorised_capital, cf.paid_up_capital, addr.city, addr.state, addr.pincode, addr.address_line_1, addr.address_line_2, addr.address_line_3, addr.coordinates, cntc.contacts, c.extra_info, tradehistory.shipment_count
  ORDER BY tp.type_value, c.year_of_establishment
WITH DATA;



CREATE INDEX company_products_result_india_view_prod_country_export_idx ON company_products_result_india_view USING gin (trade_category_type_id, product_name gin_trgm_ops, country gin_trgm_ops) WHERE (trade_category_type_id = ANY (ARRAY[24, 36]));
CREATE INDEX company_products_result_india_view_company_id_idx ON company_products_result_india_view USING btree (company_id);
CREATE INDEX company_products_result_india_view_prod_country_type_idx ON company_products_result_india_view USING gin (trade_category_type_id, product_name gin_trgm_ops, country gin_trgm_ops);
CREATE INDEX company_products_result_india_view_prod_country_idx ON company_products_result_india_view USING gin (product_name gin_trgm_ops, country gin_trgm_ops);
CREATE INDEX company_products_result_india_view_prod_idx ON company_products_result_india_view USING gin (product_name gin_trgm_ops);
CREATE UNIQUE INDEX company_products_result_india_view_uniq_idx ON company_products_result_india_view USING btree (row_id);

----------------------------------------------------------------------------------------------------------------------------------


CREATE MATERIALIZED VIEW DIN_DETAILS_VIEW as
	SELECT distinct cn.COMPANY_ID,co.COMPANY_NAME,co.EXTRA_INFO,cn.PEOPLE_ID, cn.FIRST_NAME, cn.LAST_NAME,cn.EMAIL_ADDRESS, cn.JOB_TITLE,
	cn.DEPARTMENT, cn.DATE_APPOINTMENT,cn.END_DATE, cn.contact_type_id, cn.salutation
	FROM CONTACT cn JOIN COMPANY co ON cn.COMPANY_ID=co.company_id
	WHERE cn.people_id is not null and cn.people_id not ilike '0' and cn.people_id != ''
	ORDER BY cn.PEOPLE_ID
WITH DATA;

create index din_details_view_people_idx on din_details_view using gin(people_id gin_trgm_ops);

----------------------------------------------------------------------------------------------------------------------------------
CREATE MATERIALIZED VIEW company_services_json_view_1 AS 
 SELECT sdata.product_name,
    json_agg(json_build_object('city', upper(sdata.city), 'country', upper(sdata.country), 'data', sdata.data))::jsonb AS data
   FROM ( SELECT c.product_name,
            upper(c.city::text) AS city,
            upper(c.country::text) AS country,
            array_agg(json_build_object('company_id', c.company_id, 'company_name', upper(c.company_name::text), 'office_size', c.office_size, 'company_sic', c.company_sic, 'year_of_establishment', c.year_of_establishment, 'annual_turnover', c.annual_turnover, 'registration_number', c.registration_number, 'country', upper(c.country::text), 'ownership', upper(c.ownership::text), 'liabilities', c.assets, 'liabilities', c.liabilities, 'net_worth', c.net_worth, 'authorised_capital', c.authorised_capital, 'paid_up_capital', c.paid_up_capital, 'city', upper(c.city::text), 'state', upper(c.state::text), 'pincode', c.pincode, 'address_line_1', upper(c.address_line_1::text), 'address_line_2', upper(c.address_line_2::text), 'address_line_3', upper(c.address_line_3::text), 'coordinates', c.coordinates, 'extra_info', c.extra_info)) AS data
           FROM company_services_view c
          GROUP BY c.product_name, c.city, c.country) sdata
  GROUP BY sdata.product_name
  ORDER BY sdata.product_name
WITH DATA;

CREATE INDEX company_services_json_view_product_name_idx ON company_services_json_view_1 USING gin (product_name gin_trgm_ops);
----------------------------------------------------------------------------------------------------------------------------------

 CREATE MATERIALIZED VIEW service_provider_view AS 

 SELECT DISTINCT row_number() OVER () AS row_id,
    c.company_id,
    c.company_name,
    cs.service_name as company_service_name,
    srv.service_name as service_name,
    srv.service_category,
    srv.parent_service,
    srv.service_id,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.service_description as service_summary,
    cf.annual_turnover,
    c.registration_number,
    c.country,
    c.other_office_locations,
    c.main_spoken_language,
    c.other_spoken_languages,
    c.primary_businesses_type_id,
    tp.type_value AS ownership,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info
   FROM (select * from company comp where comp.extra_info ilike '%SERVICE_PROVIDERS%')c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
     JOIN company_services cs on c.company_id = cs.company_id
     JOIN (select sr.service_name, sr.service_category, sr.service_id, psr.service_name as parent_service, psr.service_id as parent_service_id from service sr left join service psr on sr.service_parent_id= psr.service_id WHERE sr.service_category ilike 'TRADE_SERVICE')srv
     on cs.service_id=srv.service_id
     
  WHERE srv.service_category ilike 'TRADE_SERVICE' and c.extra_info ilike '%SERVICE_PROVIDERS%'
  GROUP BY c.company_id, c.company_name, c.office_size, c.company_sic, c.year_of_establishment, cf.annual_turnover, c.registration_number, c.country, tp.type_value, cf.assets, cf.liabilities, cf.net_worth, cf.authorised_capital, cf.paid_up_capital, addr.city, addr.state, addr.pincode, addr.address_line_1, addr.address_line_2, addr.address_line_3, addr.coordinates, c.extra_info, cntc.contacts,c.other_office_locations,c.main_spoken_language,c.other_spoken_languages,c.primary_businesses_type_id,
  cs.service_name, srv.service_name, srv.service_category,srv.service_id, parent_service,service_summary
  
WITH DATA;

----------------------------------------------------------------------------------------------------------------------------------

CREATE MATERIALIZED VIEW service_provider_category_view AS 
select distinct parent_service, service_id, count(company_id) OVER (PARTITION BY parent_service) AS parent_service_count,
service_name, count(company_id) OVER (PARTITION BY service_name) AS service_count from service_provider_view order by parent_service
with data;
----------------------------------------------------------------------------------------------------------------------------------

CREATE AGGREGATE textcat_all(
      basetype    = text,
      sfunc       = textcat,
      stype       = text,
      initcond    = ''
  );
  
----------------------------------------------------------------------------------------------------------------------------------

create extension pg_trgm;
CREATE EXTENSION btree_gin;

----------------------------------------------------------------------------------------------------------------------------------
--INDEXES
CREATE INDEX product_name ON product USING gin(product_name gin_trgm_ops);
CREATE INDEX company_products_view_name ON company_products_view USING gin(company_name gin_trgm_ops);
CREATE INDEX company_products_view_product_id ON company_products_view(product_id);
CREATE INDEX company_products_view_country ON company_products_view (country);
CREATE INDEX auth_tokens_index_1 ON auth_tokens(token,token_type);
CREATE INDEX company_name_country_index ON company USING gin(company_name gin_trgm_ops, country gin_trgm_ops);
CREATE INDEX TRADE_STATS_VIEW_PARENT_name ON TRADE_STATS_VIEW_PARENT USING gin(PARENT_NAME gin_trgm_ops);
CREATE INDEX TRADE_STATS_VIEW_INDEX_LEVEL3NAME ON trade_stats_view USING gin(LEVEL3NAME gin_trgm_ops);
CREATE INDEX trade_stats_view_l1_INDEX_LEVEL3NAME ON trade_stats_view_l1 USING gin(level2name gin_trgm_ops);
CREATE INDEX product_product_code_text_indx ON product USING gin(CAST(product_code as text) gin_trgm_ops);
CREATE INDEX trade_stats_port_view_dport_idx_gin ON trade_stats_port_view USING gin (destination_port gin_trgm_ops);
CREATE INDEX company_sic_idx ON company USING gin (CAST(company_sic as text) gin_trgm_ops);

----------------------------------------------------------------------------------------------------------------------------------



CREATE MATERIALIZED VIEW in_private_company_address_view AS 
 SELECT DISTINCT dense_rank() OVER (ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS row_id,
    dense_rank() OVER (PARTITION BY tp.type_value ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS ownership_row_id,
    dense_rank() OVER (PARTITION BY upper(addr.city::text) ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS city_row_id,
    dense_rank() OVER (PARTITION BY c.company_status ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS status_row_id,
    dense_rank() OVER (PARTITION BY c.establishment_year ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS year_row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.establishment_year,
    cf.annual_turnover,
    c.country,
    c.registrant,
    c.category,
    c.sub_category,
    c.company_status,
    tp.type_value AS ownership,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    cf.year AS financial_year,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    addr.address_id,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info
   FROM ( SELECT cm.company_id,
            cm.company_name,
            cm.company_title,
            cm.company_short_description,
            cm.company_detailed_description,
            cm.ownership_type_id,
            cm.primary_businesses_type_id,
            cm.additional_businesses_type_id,
            cm.legal_owner,
            cm.locale,
            cm.year_of_establishment,
            cm.number_employees,
            cm.main_spoken_language,
            cm.other_spoken_languages,
            cm.office_size,
            cm.social_media,
            cm.extra_info,
            cm.website,
            cm.expiry,
            cm.pagerank,
            cm.websiterank,
            cm.registered,
            cm.hosting_country_to,
            cm.company_sic,
            cm.registrant,
            cm.company_status,
            cm.registration_number,
            cm.country,
            cm.vat,
            cm.trade_partners,
            cm.service_description,
            cm.category,
            cm.sub_category,
            cm.balance_sheet_date,
            cm.last_agm_date,
            cm.establishment_year,
            cm.pan,
            cm.cst_number,
            cm.bank_name,
            cm.reg_number,
            cm.other_office_locations,
            cm.date_deleted
           FROM company cm
          WHERE cm.country::text ~~* 'india'::text AND cm.ownership_type_id = 7) c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
  ORDER BY c.year_of_establishment
WITH DATA;



CREATE MATERIALIZED VIEW in_opc_company_address_view AS 
 SELECT DISTINCT dense_rank() OVER (ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS row_id,
    dense_rank() OVER (PARTITION BY tp.type_value ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS ownership_row_id,
    dense_rank() OVER (PARTITION BY upper(addr.city::text) ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS city_row_id,
    dense_rank() OVER (PARTITION BY c.company_status ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS status_row_id,
    dense_rank() OVER (PARTITION BY c.establishment_year ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS year_row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.establishment_year,
    cf.annual_turnover,
    c.country,
    c.registrant,
    c.category,
    c.sub_category,
    c.company_status,
    tp.type_value AS ownership,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    cf.year AS financial_year,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    addr.address_id,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info
   FROM ( SELECT cm.company_id,
            cm.company_name,
            cm.company_title,
            cm.company_short_description,
            cm.company_detailed_description,
            cm.ownership_type_id,
            cm.primary_businesses_type_id,
            cm.additional_businesses_type_id,
            cm.legal_owner,
            cm.locale,
            cm.year_of_establishment,
            cm.number_employees,
            cm.main_spoken_language,
            cm.other_spoken_languages,
            cm.office_size,
            cm.social_media,
            cm.extra_info,
            cm.website,
            cm.expiry,
            cm.pagerank,
            cm.websiterank,
            cm.registered,
            cm.hosting_country_to,
            cm.company_sic,
            cm.registrant,
            cm.company_status,
            cm.registration_number,
            cm.country,
            cm.vat,
            cm.trade_partners,
            cm.service_description,
            cm.category,
            cm.sub_category,
            cm.balance_sheet_date,
            cm.last_agm_date,
            cm.establishment_year,
            cm.pan,
            cm.cst_number,
            cm.bank_name,
            cm.reg_number,
            cm.other_office_locations,
            cm.date_deleted
           FROM company cm
          WHERE cm.country::text ~~* 'india'::text AND cm.ownership_type_id = 34) c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
  ORDER BY c.year_of_establishment
WITH DATA;


CREATE MATERIALIZED VIEW in_public_company_address_view AS 
 SELECT DISTINCT dense_rank() OVER (ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS row_id,
    dense_rank() OVER (PARTITION BY tp.type_value ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS ownership_row_id,
    dense_rank() OVER (PARTITION BY upper(addr.city::text) ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS city_row_id,
    dense_rank() OVER (PARTITION BY c.company_status ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS status_row_id,
    dense_rank() OVER (PARTITION BY c.establishment_year ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS year_row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.establishment_year,
    cf.annual_turnover,
    c.country,
    c.registrant,
    c.category,
    c.sub_category,
    c.company_status,
    tp.type_value AS ownership,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    cf.year AS financial_year,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    addr.address_id,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info
   FROM ( SELECT cm.company_id,
            cm.company_name,
            cm.company_title,
            cm.company_short_description,
            cm.company_detailed_description,
            cm.ownership_type_id,
            cm.primary_businesses_type_id,
            cm.additional_businesses_type_id,
            cm.legal_owner,
            cm.locale,
            cm.year_of_establishment,
            cm.number_employees,
            cm.main_spoken_language,
            cm.other_spoken_languages,
            cm.office_size,
            cm.social_media,
            cm.extra_info,
            cm.website,
            cm.expiry,
            cm.pagerank,
            cm.websiterank,
            cm.registered,
            cm.hosting_country_to,
            cm.company_sic,
            cm.registrant,
            cm.company_status,
            cm.registration_number,
            cm.country,
            cm.vat,
            cm.trade_partners,
            cm.service_description,
            cm.category,
            cm.sub_category,
            cm.balance_sheet_date,
            cm.last_agm_date,
            cm.establishment_year,
            cm.pan,
            cm.cst_number,
            cm.bank_name,
            cm.reg_number,
            cm.other_office_locations,
            cm.date_deleted
           FROM company cm
          WHERE cm.country::text ~~* 'india'::text AND cm.ownership_type_id = 6) c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
  ORDER BY c.year_of_establishment
WITH DATA;


CREATE MATERIALIZED VIEW in_proprietorship_company_address_view AS 
 SELECT DISTINCT dense_rank() OVER (ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS row_id,
    dense_rank() OVER (PARTITION BY tp.type_value ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS ownership_row_id,
    dense_rank() OVER (PARTITION BY upper(addr.city::text) ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS city_row_id,
    dense_rank() OVER (PARTITION BY c.company_status ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS status_row_id,
    dense_rank() OVER (PARTITION BY c.establishment_year ORDER BY c.year_of_establishment DESC NULLS LAST, c.company_id) AS year_row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.establishment_year,
    cf.annual_turnover,
    c.country,
    c.registrant,
    c.category,
    c.sub_category,
    c.company_status,
    tp.type_value AS ownership,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    cf.year AS financial_year,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    addr.address_id,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info
   FROM ( SELECT cm.company_id,
            cm.company_name,
            cm.company_title,
            cm.company_short_description,
            cm.company_detailed_description,
            cm.ownership_type_id,
            cm.primary_businesses_type_id,
            cm.additional_businesses_type_id,
            cm.legal_owner,
            cm.locale,
            cm.year_of_establishment,
            cm.number_employees,
            cm.main_spoken_language,
            cm.other_spoken_languages,
            cm.office_size,
            cm.social_media,
            cm.extra_info,
            cm.website,
            cm.expiry,
            cm.pagerank,
            cm.websiterank,
            cm.registered,
            cm.hosting_country_to,
            cm.company_sic,
            cm.registrant,
            cm.company_status,
            cm.registration_number,
            cm.country,
            cm.vat,
            cm.trade_partners,
            cm.service_description,
            cm.category,
            cm.sub_category,
            cm.balance_sheet_date,
            cm.last_agm_date,
            cm.establishment_year,
            cm.pan,
            cm.cst_number,
            cm.bank_name,
            cm.reg_number,
            cm.other_office_locations,
            cm.date_deleted
           FROM company cm
          WHERE cm.country::text ~~* 'india'::text AND cm.ownership_type_id = 8) c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
  ORDER BY c.year_of_establishment
WITH DATA;



CREATE UNIQUE INDEX in_proprietorship_company_address_view_uniq_idx ON in_proprietorship_company_address_view USING btree (company_id, address_id, ownership_row_id);
CREATE INDEX in_proprietorship_company_address_view_cid_idx ON in_proprietorship_company_address_view USING btree (company_id);
CREATE INDEX in_proprietorship_company_address_view_reg_date_idx ON in_proprietorship_company_address_view USING btree (year_of_establishment DESC NULLS LAST);
CREATE INDEX in_proprietorship_company_address_view_orid_idx ON in_proprietorship_company_address_view USING btree (ownership_row_id);
CREATE INDEX in_proprietorship_company_address_view_city_gin_idx ON in_proprietorship_company_address_view USING gin (city gin_trgm_ops, ownership_row_id);

CREATE UNIQUE INDEX in_opc_company_address_view_uniq_idx ON in_opc_company_address_view USING btree (company_id, address_id, ownership_row_id);
CREATE INDEX in_opc_company_address_view_cid_idx ON in_opc_company_address_view USING btree (company_id);
CREATE INDEX in_opc_company_address_view_reg_date_idx ON in_opc_company_address_view USING btree (year_of_establishment DESC NULLS LAST);
CREATE INDEX in_opc_company_address_view_orid_idx ON in_opc_company_address_view USING btree (ownership_row_id);
CREATE INDEX in_opc_company_address_view_city_gin_idx ON in_opc_company_address_view USING gin (city gin_trgm_ops, ownership_row_id);

CREATE UNIQUE INDEX in_private_company_address_view_uniq_idx ON in_private_company_address_view USING btree (company_id, address_id, ownership_row_id);
CREATE INDEX in_private_company_address_view_cid_idx ON in_private_company_address_view USING btree (company_id);
CREATE INDEX in_private_company_address_view_reg_date_idx ON in_private_company_address_view USING btree (year_of_establishment DESC NULLS LAST);
CREATE INDEX in_private_company_address_view_orid_idx ON in_private_company_address_view USING btree (ownership_row_id);
CREATE INDEX in_private_company_address_view_city_gin_idx ON in_private_company_address_view USING gin (city gin_trgm_ops, ownership_row_id);

CREATE UNIQUE INDEX in_public_company_address_view_uniq_idx ON in_public_company_address_view USING btree (company_id, address_id, ownership_row_id);
CREATE INDEX in_public_company_address_view_cid_idx ON in_public_company_address_view USING btree (company_id);
CREATE INDEX in_public_company_address_view_reg_date_idx ON in_public_company_address_view USING btree (year_of_establishment DESC NULLS LAST);
CREATE INDEX in_public_company_address_view_orid_idx ON in_public_company_address_view USING btree (ownership_row_id);
CREATE INDEX in_public_company_address_view_city_gin_idx ON in_public_company_address_view USING gin (city gin_trgm_ops, ownership_row_id);

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE MATERIALIZED VIEW public.overseas_exporters_view
TABLESPACE pg_default
AS
 SELECT DISTINCT row_number() OVER () AS row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.company_short_description,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    c.country,
    tp.type_value AS ownership,
    cf.annual_turnover,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    pr.product_name,
    pr.product_code::text AS product_code,
    cp.trade_category_type_id,
    pr.product_id,
    array_to_string((array_agg(pr.product_name) OVER (PARTITION BY c.company_id))[1:6], ', '::text) AS combined_products,
    array_to_string(array_agg(DISTINCT cp.product_keywords), ','::text) AS product_keywords,
    array_to_string(array_agg(cp.trade_duration), ','::text) AS trade_duration,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info,
    tradehistory.shipment_count,
        CASE
            WHEN c.country::text ~~* 'UK'::text THEN 1
            ELSE 0
        END AS sort
   FROM company c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
     LEFT JOIN ( SELECT th.company_id,
            count(th.company_id) AS shipment_count
           FROM trade_history th
          GROUP BY th.company_id) tradehistory ON tradehistory.company_id = c.company_id
     JOIN company_products cp ON c.company_id = cp.company_id
     JOIN product pr ON cp.product_id = pr.product_id
  WHERE c.country::text !~~* 'India'::text AND (cp.trade_category_type_id = ANY (ARRAY[23, 35]))
  GROUP BY c.company_id, c.company_name, c.company_short_description, pr.product_id, pr.product_name, pr.product_code, c.office_size, c.company_sic, c.year_of_establishment, c.registration_number, c.country, tp.type_value, cp.trade_category_type_id, cf.annual_turnover, cf.assets, cf.liabilities, cf.net_worth, cf.authorised_capital, cf.paid_up_capital, addr.city, addr.state, addr.pincode, addr.address_line_1, addr.address_line_2, addr.address_line_3, addr.coordinates, cntc.contacts, c.extra_info, tradehistory.shipment_count
  ORDER BY tp.type_value, c.year_of_establishment
WITH DATA;


CREATE MATERIALIZED VIEW public.overseas_importers_view
TABLESPACE pg_default
AS
 SELECT DISTINCT row_number() OVER () AS row_id,
    c.company_id,
    c.company_name,
    c.office_size,
    c.company_sic,
    c.year_of_establishment,
    c.company_short_description,
    COALESCE(c.registration_number, 0::numeric) AS registration_number,
    c.country,
    tp.type_value AS ownership,
    cf.annual_turnover,
    cf.assets,
    cf.liabilities,
    cf.net_worth,
    cf.authorised_capital,
    cf.paid_up_capital,
    pr.product_name,
    pr.product_code::text AS product_code,
    cp.trade_category_type_id,
    pr.product_id,
    array_to_string((array_agg(pr.product_name) OVER (PARTITION BY c.company_id))[1:6], ', '::text) AS combined_products,
    array_to_string(array_agg(DISTINCT cp.product_keywords), ','::text) AS product_keywords,
    array_to_string(array_agg(cp.trade_duration), ','::text) AS trade_duration,
    addr.city,
    addr.state,
    addr.pincode,
    addr.address_line_1,
    addr.address_line_2,
    addr.address_line_3,
    addr.coordinates,
    cntc.contacts,
    c.extra_info,
    tradehistory.shipment_count,
        CASE
            WHEN c.country::text ~~* 'UK'::text THEN 1
            ELSE 0
        END AS sort
   FROM company c
     LEFT JOIN ( SELECT DISTINCT ON (company_financials.company_id) company_financials.company_id,
            company_financials.assets,
            company_financials.net_worth,
            company_financials.year,
            company_financials.liabilities,
            company_financials.annual_turnover,
            company_financials.authorised_capital,
            company_financials.paid_up_capital
           FROM company_financials
          ORDER BY company_financials.company_id, company_financials.year DESC) cf ON c.company_id = cf.company_id
     LEFT JOIN type tp ON c.ownership_type_id = tp.type_id
     LEFT JOIN address addr ON addr.entity_id = c.company_id
     LEFT JOIN ( SELECT contact.company_id,
            count(contact.company_id) AS contacts
           FROM contact
          WHERE contact.email_address IS NOT NULL OR contact.mobile IS NOT NULL
          GROUP BY contact.company_id) cntc ON cntc.company_id = c.company_id
     LEFT JOIN ( SELECT th.company_id,
            count(th.company_id) AS shipment_count
           FROM trade_history th
          GROUP BY th.company_id) tradehistory ON tradehistory.company_id = c.company_id
     JOIN company_products cp ON c.company_id = cp.company_id
     JOIN product pr ON cp.product_id = pr.product_id
  WHERE c.country::text !~~* 'India'::text AND (cp.trade_category_type_id = ANY (ARRAY[24, 36]))
  GROUP BY c.company_id, c.company_name, c.company_short_description, pr.product_id, pr.product_name, pr.product_code, c.office_size, c.company_sic, c.year_of_establishment, c.registration_number, c.country, tp.type_value, cp.trade_category_type_id, cf.annual_turnover, cf.assets, cf.liabilities, cf.net_worth, cf.authorised_capital, cf.paid_up_capital, addr.city, addr.state, addr.pincode, addr.address_line_1, addr.address_line_2, addr.address_line_3, addr.coordinates, cntc.contacts, c.extra_info, tradehistory.shipment_count
  ORDER BY tp.type_value, c.year_of_establishment
WITH DATA;

CREATE INDEX overseas_importers_view_im_ex_tsv_prodd_country_idx_1 ON overseas_importers_view USING gin (product_name, country);
CREATE INDEX overseas_importers_view_im_ex_tsv_prodd_idx ON overseas_importers_view USING gin (product_name);
CREATE INDEX overseas_importers_view_im_ex_tsv_country_idx ON overseas_importers_view USING gin (country gin_trgm_ops);
CREATE INDEX overseas_importers_view_im_new_tsv_prodd_country_export ON overseas_importers_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops) WHERE (trade_category_type_id = ANY (ARRAY[24, 36]));
CREATE UNIQUE INDEX overseas_importers_view_im_ex_tsv_uniq_idx ON overseas_importers_view USING btree (row_id);
CREATE INDEX overseas_importers_view_im_new_tsv_prodd_export_idx ON overseas_importers_view USING gin (trade_category_type_id, product_name) WHERE (trade_category_type_id = ANY (ARRAY[24, 36]));
CREATE INDEX overseas_importers_view_im_ex_tsv_prodd_country_type_i ON overseas_importers_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops);
CREATE INDEX overseas_importers_view_im_ex_tsv_company_id_idx ON overseas_importers_view USING btree (company_id);
CREATE INDEX overseas_importers_view_im_ex_tsv_prod_code_idx_1 ON overseas_importers_view USING gin (product_code gin_trgm_ops);
CREATE INDEX overseas_importers_view_im_ex_p_c_s_t_export_1 ON overseas_importers_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops) WHERE (((trade_category_type_id = ANY (ARRAY[24, 36])) AND (shipment_count > 0)) AND (trade_duration <> ''::text));
CREATE INDEX overseas_importers_pr_ov_im_ex_uk_p_c_s_t_export_1 ON overseas_importers_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops) WHERE ((trade_category_type_id = ANY (ARRAY[24, 36])) AND ((country)::text ~~* 'UK'::text));

CREATE INDEX overseas_exporters_pr_ov_im_ex_uk_p_c_s_t_export_1 ON overseas_exporters_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops) WHERE ((trade_category_type_id = ANY (ARRAY[24, 36])) AND ((country)::text ~~* 'UK'::text));
CREATE INDEX overseas_exporters_view_im_ex_p_c_s_t_export_1 ON overseas_exporters_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops) WHERE (((trade_category_type_id = ANY (ARRAY[24, 36])) AND (shipment_count > 0)) AND (trade_duration <> ''::text));
CREATE INDEX overseas_exporters_view_im_ex_tsv_prod_code_idx_1 ON overseas_exporters_view USING gin (product_code gin_trgm_ops);
CREATE INDEX overseas_exporters_view_im_ex_tsv_company_id_idx ON overseas_exporters_view USING btree (company_id);
CREATE INDEX overseas_exporters_view_im_ex_tsv_prodd_country_type_i ON overseas_exporters_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops);
CREATE INDEX overseas_exporters_view_im_new_tsv_prodd_export_idx ON overseas_exporters_view USING gin (trade_category_type_id, product_name) WHERE (trade_category_type_id = ANY (ARRAY[24, 36]));
CREATE UNIQUE INDEX overseas_exporters_view_im_ex_tsv_uniq_idx ON overseas_exporters_view USING btree (row_id);
CREATE INDEX overseas_exporters_view_im_new_tsv_prodd_country_export ON overseas_exporters_view USING gin (trade_category_type_id, product_name, country gin_trgm_ops) WHERE (trade_category_type_id = ANY (ARRAY[24, 36]));
CREATE INDEX overseas_exporters_view_im_ex_tsv_country_idx ON overseas_exporters_view USING gin (country gin_trgm_ops);
CREATE INDEX overseas_exporters_view_im_ex_tsv_prodd_idx ON overseas_exporters_view USING gin (product_name);
CREATE INDEX overseas_exporters_view_im_ex_tsv_prodd_country_idx_1 ON overseas_exporters_view USING gin (product_name, country);