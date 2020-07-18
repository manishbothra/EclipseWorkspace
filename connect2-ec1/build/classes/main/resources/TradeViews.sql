DROP MATERIALIZED VIEW IF EXISTS "trade_historical_stats_view";
DROP MATERIALIZED VIEW IF EXISTS "trade_historical_stats_view_parent";
DROP MATERIALIZED VIEW IF EXISTS "trade_historical_stats_view_l1";
DROP MATERIALIZED VIEW IF EXISTS "trade_historical_stats_view_l2";


CREATE MATERIALIZED VIEW trade_historical_stats_view AS 
 SELECT row_number() OVER () AS id,
    a.trade_category_type_id,
    b.product_code AS parent_code,
    b.level4code,
    b.level3code,
    b.level2code,
    b.parent_name,
    b.level2name,
    b.level3name,
    b.level4name,
    a.quantity,
    a.value_rs,
    a.value_usd,
    a.qty_unit,
    a.source_location_id,
    a.target_location_id,
    a.source_region_id,
    a.source_location_name,
    a.source_region_name,
    to_date(a.trade_date::text, 'MM/DD/YYYY'::text) AS trade_date
   FROM ( SELECT p.product_code AS code,
            sum(t.quantity) AS quantity,
            sum(t.value_rs) AS value_rs,
            sum(t.value_usd) AS value_usd,
            t.qty_unit,
            t.trade_category_type_id,
            t.source_location_id,
            t.target_location_id,
            l.region_id AS source_region_id,
            l.country AS source_location_name,
            t.trade_date,
            r.region_name AS source_region_name
           FROM location l,
            trade_historical_data t,
            product p,
            region r
          WHERE t.source_location_id = l.location_id AND p.product_id = t.product_id AND l.region_id = r.region_id
          GROUP BY p.product_code, t.trade_category_type_id, t.source_location_id, t.target_location_id, l.region_id, l.country, t.trade_date, r.region_name, t.qty_unit) a
     JOIN ( SELECT p.product_code,
            p.product_name AS parent_name,
            q.product_name AS level2name,
            r.product_name AS level3name,
            s.product_code AS level4code,
            s.product_name AS level4name,
            r.product_code AS level3code,
            q.product_code AS level2code
           FROM product p,
            product q,
            product r,
            product s
          WHERE s.parent_id = r.product_code AND r.parent_id = q.product_code AND q.parent_id = p.product_code
          ORDER BY p.product_code) b ON a.code = b.level4code
  GROUP BY a.trade_category_type_id, b.parent_name, b.level2name, b.level3name, b.level4name, b.product_code, a.quantity, a.value_rs, a.value_usd, a.qty_unit, b.level3code, b.level2code, b.level4code, a.source_location_id, a.target_location_id, a.source_region_id, a.source_location_name, a.trade_date, a.source_region_name
  ORDER BY b.product_code
WITH DATA;


CREATE MATERIALIZED VIEW trade_historical_stats_view_parent AS 
 SELECT row_number() OVER () AS id,
    trade_historical_stats_view.trade_category_type_id,
    trade_historical_stats_view.parent_code,
    trade_historical_stats_view.parent_name,
    sum(trade_historical_stats_view.quantity) AS quantity,
    sum(trade_historical_stats_view.value_rs) AS value_rs,
    sum(trade_historical_stats_view.value_usd) AS value_usd,
    trade_historical_stats_view.qty_unit,
    trade_historical_stats_view.source_location_id,
    trade_historical_stats_view.target_location_id,
    trade_historical_stats_view.source_region_id,
    trade_historical_stats_view.source_region_name,
    trade_historical_stats_view.source_location_name,
    trade_historical_stats_view.trade_date
   FROM trade_historical_stats_view
  GROUP BY trade_historical_stats_view.trade_category_type_id, trade_historical_stats_view.parent_name, trade_historical_stats_view.parent_code, trade_historical_stats_view.qty_unit, trade_historical_stats_view.source_location_id, trade_historical_stats_view.target_location_id, trade_historical_stats_view.source_region_id, trade_historical_stats_view.source_location_name, trade_historical_stats_view.source_region_name, trade_historical_stats_view.trade_date
WITH DATA;


CREATE MATERIALIZED VIEW trade_historical_stats_view_l1 AS 
 SELECT row_number() OVER () AS id,
    trade_historical_stats_view.trade_category_type_id,
    trade_historical_stats_view.level2code,
    trade_historical_stats_view.level2name,
    trade_historical_stats_view.parent_code,
    sum(trade_historical_stats_view.quantity) AS quantity,
    sum(trade_historical_stats_view.value_rs) AS value_rs,
    sum(trade_historical_stats_view.value_usd) AS value_usd,
    trade_historical_stats_view.qty_unit,
    trade_historical_stats_view.source_location_id,
    trade_historical_stats_view.target_location_id,
    trade_historical_stats_view.source_region_id,
    trade_historical_stats_view.source_region_name,
    trade_historical_stats_view.source_location_name,
    trade_historical_stats_view.trade_date
   FROM trade_historical_stats_view
  GROUP BY trade_historical_stats_view.trade_category_type_id, trade_historical_stats_view.level2name, trade_historical_stats_view.level2code, trade_historical_stats_view.parent_code, trade_historical_stats_view.qty_unit, trade_historical_stats_view.source_location_id, trade_historical_stats_view.target_location_id, trade_historical_stats_view.source_region_id, trade_historical_stats_view.source_location_name, trade_historical_stats_view.source_region_name, trade_historical_stats_view.trade_date
WITH DATA;


CREATE MATERIALIZED VIEW trade_historical_stats_view_l2 AS 
 SELECT row_number() OVER () AS id,
    trade_historical_stats_view.trade_category_type_id,
    trade_historical_stats_view.level3code,
    trade_historical_stats_view.level3name,
    trade_historical_stats_view.level2code,
    sum(trade_historical_stats_view.quantity) AS quantity,
    sum(trade_historical_stats_view.value_rs) AS value_rs,
    sum(trade_historical_stats_view.value_usd) AS value_usd,
    trade_historical_stats_view.qty_unit,
    trade_historical_stats_view.source_location_id,
    trade_historical_stats_view.target_location_id,
    trade_historical_stats_view.source_region_id,
    trade_historical_stats_view.source_region_name,
    trade_historical_stats_view.source_location_name,
    trade_historical_stats_view.trade_date
   FROM trade_historical_stats_view
  GROUP BY trade_historical_stats_view.trade_category_type_id, trade_historical_stats_view.level2name, trade_historical_stats_view.level3name, trade_historical_stats_view.level2code, trade_historical_stats_view.level3code, trade_historical_stats_view.qty_unit, trade_historical_stats_view.source_location_id, trade_historical_stats_view.target_location_id, trade_historical_stats_view.source_region_id, trade_historical_stats_view.source_location_name, trade_historical_stats_view.source_region_name, trade_historical_stats_view.trade_date
WITH DATA;

------------------------------------------------------------------------------------------------

CREATE MATERIALIZED VIEW trade_stats_port_export_view AS 
 SELECT row_number() OVER () AS id,
    tr.trade_category_type_id,
    p.product_code::text AS product_code,
    COALESCE(tr.description, p.product_name) AS description,
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
  WHERE tr.trade_category_type_id = 23 AND tr.origin_port IS NOT NULL AND tr.destination_port::text !~~* 'India'::text
  GROUP BY tr.trade_category_type_id, p.product_code, tr.description, p.product_name, tr.source_location_id, tr.target_location_id, tr.origin_port, tr.destination_port, tr.trade_date
WITH DATA;



CREATE MATERIALIZED VIEW trade_stats_port_import_view AS 
 SELECT row_number() OVER () AS id,
    tr.trade_category_type_id,
    p.product_code::text AS product_code,
    COALESCE(tr.description, p.product_name) AS description,
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
  WHERE tr.trade_category_type_id = 24 AND tr.origin_port IS NOT NULL AND tr.destination_port::text !~~* 'India'::text
  GROUP BY tr.trade_category_type_id, p.product_code, tr.description, p.product_name, tr.source_location_id, tr.target_location_id, tr.origin_port, tr.destination_port, tr.trade_date
WITH DATA;



CREATE INDEX trade_stats_port_export_view_op_d_idx ON trade_stats_port_export_view USING btree (origin_port, trade_date DESC);
CREATE INDEX trade_stats_port_export_view_op_d_pc ON trade_stats_port_export_view USING btree (trade_category_type_id, origin_port, trade_date, product_code);
CREATE INDEX trade_stats_port_export_view_desc_idx ON trade_stats_port_export_view USING gin (description gin_trgm_ops);
CREATE INDEX trade_stats_port_export_view_pc_idx ON trade_stats_port_export_view USING gin (product_code gin_trgm_ops);
CREATE INDEX trade_stats_port_export_view_d_idx ON trade_stats_port_export_view USING btree (trade_date);
CREATE INDEX trade_stats_port_export_view_dp_idx ON trade_stats_port_export_view USING gin (destination_port gin_trgm_ops);
CREATE INDEX trade_stats_port_export_view_op_idx ON trade_stats_port_export_view USING gin (origin_port gin_trgm_ops);
CREATE INDEX trade_stats_port_export_view_tm_desc_idx ON trade_stats_port_export_view USING gin (trade_category_type_id, trade_month, description gin_trgm_ops);
CREATE INDEX trade_stats_port_export_view_tm_idx ON trade_stats_port_export_view USING gin (trade_month);
CREATE UNIQUE INDEX trade_stats_port_export_view_unique_idx ON trade_stats_port_export_view USING btree (id);
CREATE INDEX trade_stats_port_export_view_dsc_dp_idx ON trade_stats_port_export_view USING gin (description gin_trgm_ops, destination_port gin_trgm_ops);


CREATE INDEX trade_stats_port_import_view_op_d_idx ON trade_stats_port_import_view USING btree (origin_port, trade_date DESC);
CREATE INDEX trade_stats_port_import_view_op_d_pc ON trade_stats_port_import_view USING btree (trade_category_type_id, origin_port, trade_date, product_code);
CREATE INDEX trade_stats_port_import_view_desc_idx ON trade_stats_port_import_view USING gin (description gin_trgm_ops);
CREATE INDEX trade_stats_port_import_view_pc_idx ON trade_stats_port_import_view USING gin (product_code gin_trgm_ops);
CREATE INDEX trade_stats_port_import_view_d_idx ON trade_stats_port_import_view USING btree (trade_date);
CREATE INDEX trade_stats_port_import_view_dp_idx ON trade_stats_port_import_view USING gin (destination_port gin_trgm_ops);
CREATE INDEX trade_stats_port_import_view_op_idx ON trade_stats_port_import_view USING gin (origin_port gin_trgm_ops);
CREATE INDEX trade_stats_port_import_view_tm_desc_idx ON trade_stats_port_import_view USING gin (trade_category_type_id, trade_month, description gin_trgm_ops);
CREATE INDEX trade_stats_port_import_view_tm_idx ON trade_stats_port_import_view USING gin (trade_month);
CREATE UNIQUE INDEX trade_stats_port_import_view_unique_idx ON trade_stats_port_import_view USING btree (id);
CREATE INDEX trade_stats_port_import_view_dsc_dp_idx ON trade_stats_port_import_view USING gin (description gin_trgm_ops, destination_port gin_trgm_ops);

------------------------------------------------------------------------------------------------
CREATE MATERIALIZED VIEW trade_stats_portwise_summary_view AS 
 SELECT row_number() OVER () AS id,
    tr.trade_category_type_id,
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
  WHERE tr.origin_port IS NOT NULL AND tr.destination_port::text !~~* 'India'::text
  GROUP BY tr.trade_category_type_id, tr.source_location_id, tr.target_location_id, tr.origin_port, tr.destination_port, tr.trade_date
WITH DATA;

CREATE INDEX trade_stats_portwise_summary_view_ti_td_op_23_idx ON trade_stats_portwise_summary_view USING btree (trade_category_type_id, origin_port, trade_date) where trade_category_type_id=23;
CREATE INDEX trade_stats_portwise_summary_view_ti_td_op_24_idx ON trade_stats_portwise_summary_view USING btree (trade_category_type_id, origin_port, trade_date) where trade_category_type_id=24;

------------------------------------------------------------------------------------------------






CLUSTER TRADE_HISTORICAL_STATS_VIEW USING trade_historical_stats_view_new_date_idx_2;


CREATE INDEX trade_historical_stats_view_new_index_1 ON trade_historical_stats_view USING btree (trade_category_type_id, target_location_id, trade_date);
CREATE INDEX trade_historical_stats_view_new_index_level4name ON trade_historical_stats_view USING gin (level4name gin_trgm_ops);
CREATE INDEX trade_historical_stats_view_new_level4code_text_indx ON trade_historical_stats_view USING gin (((level4code)::text) gin_trgm_ops);
CREATE INDEX trade_historical_stats_view_new_date_type ON trade_historical_stats_view USING btree (trade_category_type_id, trade_date);
CREATE INDEX trade_historical_stats_view_new_date_idx_2 ON trade_historical_stats_view USING btree (trade_date);
CREATE INDEX trade_historical_stats_view_new_level4code_indx ON trade_historical_stats_view USING btree (level4code);


CREATE INDEX trade_historical_stats_view_parent_new_index_1 ON trade_historical_stats_view_parent USING btree (trade_category_type_id, target_location_id, trade_date);
CREATE INDEX trade_historical_stats_view_parent_new_parent_name ON trade_historical_stats_view_parent USING gin (parent_name gin_trgm_ops);

CREATE INDEX trade_historical_stats_view_l1_new_view_index_1 ON trade_historical_stats_view_l1 USING btree (trade_category_type_id, target_location_id, trade_date, parent_code);
CREATE INDEX trade_historical_stats_view_l1_new_level2code ON trade_historical_stats_view_l1 USING btree (trade_category_type_id, level2code);
CREATE INDEX trade_historical_stats_view_l1_new_index_level3name ON trade_historical_stats_view_l1 USING gin (level2name gin_trgm_ops);

CREATE INDEX trade_historical_stats_view_l2_new_view_index_1 ON trade_historical_stats_view_l2 USING btree (trade_category_type_id, target_location_id, trade_date, level2code);
CREATE INDEX trade_historical_stats_view_l2_new_level3code ON trade_historical_stats_view_l2 USING btree (trade_category_type_id, level3code);
CREATE INDEX trade_historical_stats_view_l2_new_index_level3name ON trade_historical_stats_view_l2 USING gin (level3name gin_trgm_ops);
