package com.connect2.ec.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.connect2.dao.User;
import com.connect2.datasource.C2IDataSource;
import com.connect2.ec.constants.ECType;
import com.connect2.ec.controller.InquiryDetails;
import com.connect2.ec.domain.C2IEcDashboard;
import com.connect2.ec.domain.C2IEcProdSellingInfo;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.ec.domain.C2IEcProductImage;
import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.ec.domain.C2IEcSellerBrand;
import com.connect2.ec.domain.C2IEcStore;
import com.connect2.ec.domain.C2IEcStoreDocs;
import com.connect2.utility.C2IUtils;
import com.connect2.utility.DBUtility;
import com.connect2.utility.PasswordUtil;
import com.google.gson.Gson;

@Repository
public class C2IEcommerceDao {

	@Autowired
	private C2IDataSource dataSource;
	private final Logger slf4jLogger = LoggerFactory.getLogger(C2IEcommerceDao.class);

	private Connection getConnection() {
		return dataSource.getConnection();
	}

	public int insertSellerDetails(C2IEcSeller ecSeller) throws SQLException {
		PreparedStatement stmt = null;
		int ecSellerId=0;
		ResultSet rs = null;
		
		slf4jLogger.info("LOCAL-DATA: INSERTING SELLER DETAILS");
		Connection conn = getConnection();
		
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("insert into c2i_ec_seller(company_id,username,password,app_id,app_secret,merchant_id")
				.append(",mws_auth_token,location_id,marketplaces)" )
				.append("values(?,?,?,?,?,?,?,?,?) returning ec_seller_id");
			
			stmt = conn.prepareStatement(sql.toString());
	
			User loggedInUser  = C2IUtils.getLoggedInUser();
			
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(loggedInUser.getCompanyId());
			paramValues.add(ecSeller.getUsername());
			paramValues.add(ecSeller.getPassword());
			paramValues.add(ecSeller.getAppId());
			paramValues.add(ecSeller.getAppSecret());
			paramValues.add(ecSeller.getMerchantId());
			paramValues.add(ecSeller.getMwsAuthToken());
			paramValues.add(ecSeller.getLocationId());
			
			Set<String> marketplaces = new HashSet<>();
			for(String mp: ecSeller.getMarketplaces()) {
				marketplaces.add(mp);
			}
			
			paramValues.add(StringUtils.join(marketplaces, ","));			
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			
			while(rs.next()) {
				ecSellerId = rs.getInt("ec_seller_id");
				ecSeller.setEcSellerId(ecSellerId);
			}
		} catch (Exception e) {
			slf4jLogger.error("inserting seller details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ecSellerId;
	}
	
	public C2IEcSeller getSellerDetails() throws SQLException {
		PreparedStatement stmt = null;
		C2IEcSeller ecSeller = new C2IEcSeller();
		ResultSet rs = null;
		
		slf4jLogger.info("LOCAL-DATA: INSERTING SELLER DETAILS");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("select * from c2i_ec_seller where company_id=?");
			
			stmt = conn.prepareStatement(sql.toString());
	
			User loggedInUser  = C2IUtils.getLoggedInUser();
			
			List<Object> paramValues = new ArrayList<Object>();	
		
			paramValues.add(loggedInUser.getCompanyId());
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			
			while(rs.next()) {
				ecSeller.setEcSellerId(rs.getInt("ec_seller_id"));;
				ecSeller.setUsername(rs.getString("username"));
				ecSeller.setPassword(rs.getString("password"));
				ecSeller.setAppId(rs.getString("app_id"));
				ecSeller.setAppSecret(rs.getString("app_secret"));
				ecSeller.setMerchantId(rs.getString("merchant_id"));
				ecSeller.setMwsAuthToken(rs.getString("mws_auth_token"));
				ecSeller.setLocationId(rs.getString("location_id"));
				ecSeller.setMarketplaces(Arrays.asList(rs.getArray("marketplaces").toString()));
				
			}
		} catch (Exception e) {
			slf4jLogger.error("inserting seller details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ecSeller;
	}
	
	public int createStore(C2IEcStore store) throws SQLException {
		PreparedStatement stmt = null;
		int ecStoreId=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: CREATING NEW EC STORE");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("insert into c2i_ec_store(store_name,store_logo_url,company_id,seller_email,seller_contact,seller_name,seller_password")
				.append(",pick_up_address,pick_up_pincode,gstin_number,business_name,pan_number,business_type,address_line_1,address_line_2,pincode,city,state,bank_account_number")
				.append(",bank_name,ifsc,status)" )
				.append("values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) returning ec_store_id");
			
			stmt = conn.prepareStatement(sql.toString());
	
			User loggedInUser  = C2IUtils.getLoggedInUser();
			
			List<Object> paramValues = new ArrayList<Object>();	
			paramValues.add(store.getStoreName());
			paramValues.add(store.getStoreLogoUrl());
			paramValues.add(loggedInUser.getCompanyId());
			paramValues.add(store.getSellerEmail());
			paramValues.add(store.getSellerContact());
			paramValues.add(store.getSellerName());
			paramValues.add(PasswordUtil.getInstance().getEncryptedPassword(store.getSellerPassword()));
			paramValues.add(store.getPickUpAddress());
			paramValues.add(store.getPickUpPincode());
			paramValues.add(store.getGstinNumber());
			paramValues.add(store.getBusinessName());
			paramValues.add(store.getPanNumber());
			paramValues.add(store.getBusinessType());
			paramValues.add(store.getAddressLine1());
			paramValues.add(store.getAddressLine2());
			paramValues.add(store.getPincode());
			paramValues.add(store.getCity());
			paramValues.add(store.getState());
			paramValues.add(store.getBankAccountNumber());
			paramValues.add(store.getBankName());
			paramValues.add(store.getIfsc());
			paramValues.add(store.getStatus());
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			
			while(rs.next()) {
				ecStoreId = rs.getInt("ec_store_id");
				store.setEcStoreId(ecStoreId);
			}
		} catch (Exception e) {
			slf4jLogger.error("create store details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ecStoreId;
	}
	
	public String insertStoreDocs(C2IEcStoreDocs c2iEcStoreDocs) throws SQLException {
		PreparedStatement stmt = null;
		int rows=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: INSERTING STORE DOCS");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("insert into c2i_ec_store_docs(ec_store_id,document_name,document_type,document_data) ")
				.append("values(?,?,?,?) returning ec_doc_id");
			
			stmt = conn.prepareStatement(sql.toString());
			
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(c2iEcStoreDocs.getEcStoreId());
			paramValues.add(c2iEcStoreDocs.getDocumentName());
			paramValues.add(c2iEcStoreDocs.getDocumentType());
			paramValues.add(c2iEcStoreDocs.getDocumentData());
//			paramValues.add(c2iEcStoreDocs.getDocumentMeta());
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			while(rs.next()) {
				c2iEcStoreDocs.setEcDocId(rs.getInt("ec_doc_id"));
				rows++;
			}
		} catch (Exception e) {
			slf4jLogger.error("create store details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ""+rows;
	}
	
	
	public C2IEcStore getStoreDetails(C2IEcStore c2iEcStore) throws SQLException {
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
				
			sql.append("select * from c2i_ec_store where company_id=?");
			pvs.add(c2iEcStore.getCompanyId());
		
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				
				c2iEcStore.setStoreName(rs.getString("store_name"));
				c2iEcStore.setStoreLogoUrl(rs.getString("store_logo_url"));
				c2iEcStore.setCompanyId(rs.getInt("company_id"));
				c2iEcStore.setSellerEmail(rs.getString("seller_email"));
				c2iEcStore.setSellerContact(rs.getString("seller_contact"));
				c2iEcStore.setSellerName(rs.getString("seller_name"));
				c2iEcStore.setPickUpAddress(rs.getString("pick_up_address"));
				c2iEcStore.setPickUpPincode(rs.getInt("pick_up_pincode"));
				c2iEcStore.setGstinNumber(rs.getString("gstin_number"));
				c2iEcStore.setBusinessName(rs.getString("business_name"));
				c2iEcStore.setPanNumber(rs.getString("pan_number"));
				c2iEcStore.setBusinessType(rs.getString("business_type"));
				c2iEcStore.setAddressLine1(rs.getString("address_line_1"));
				c2iEcStore.setAddressLine2(rs.getString("address_line_2"));
				c2iEcStore.setPincode(rs.getString("pincode"));
				c2iEcStore.setCity(rs.getString("city"));
				c2iEcStore.setState(rs.getString("state"));
				c2iEcStore.setBankAccountNumber(rs.getInt("bank_account_number"));
				c2iEcStore.setBankName(rs.getString("bank_name"));
				c2iEcStore.setIfsc(rs.getString("ifsc"));
				c2iEcStore.setStatus(rs.getString("status"));
				c2iEcStore.setDateCreated(rs.getString("date_created"));
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getStore function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		
		return c2iEcStore;
	}
	
	public List<C2IEcStore> getDetailedStores(long companyId) throws Exception {
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		List<C2IEcStore> stores = new ArrayList<>();
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
				
			sql.append("select * from c2i_ec_store where company_id=?");
			pvs.add(companyId);
		
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				C2IEcStore c2iEcStore = new C2IEcStore();
				c2iEcStore.setEcStoreId(rs.getInt("ec_store_id"));
				c2iEcStore.setStoreName(rs.getString("store_name"));
				c2iEcStore.setStoreLogoUrl(rs.getString("store_logo_url"));
				c2iEcStore.setCompanyId(rs.getInt("company_id"));
				c2iEcStore.setSellerEmail(rs.getString("seller_email"));
				c2iEcStore.setSellerContact(rs.getString("seller_contact"));
				c2iEcStore.setSellerName(rs.getString("seller_name"));
				c2iEcStore.setPickUpAddress(rs.getString("pick_up_address"));
				c2iEcStore.setPickUpPincode(rs.getInt("pick_up_pincode"));
				c2iEcStore.setGstinNumber(rs.getString("gstin_number"));
				c2iEcStore.setBusinessName(rs.getString("business_name"));
				c2iEcStore.setPanNumber(rs.getString("pan_number"));
				c2iEcStore.setBusinessType(rs.getString("business_type"));
				c2iEcStore.setAddressLine1(rs.getString("address_line_1"));
				c2iEcStore.setAddressLine2(rs.getString("address_line_2"));
				c2iEcStore.setPincode(rs.getString("pincode"));
				c2iEcStore.setCity(rs.getString("city"));
				c2iEcStore.setState(rs.getString("state"));
				c2iEcStore.setBankAccountNumber(rs.getInt("bank_account_number"));
				c2iEcStore.setBankName(rs.getString("bank_name"));
				c2iEcStore.setIfsc(rs.getString("ifsc"));
				c2iEcStore.setStatus(rs.getString("status"));
				c2iEcStore.setDateCreated(rs.getString("date_created"));				
				stores.add(c2iEcStore);
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getStores function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		return stores;
	}
	
	public List<C2IEcStore> getBasicStores(long companyId) throws Exception {
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		List<C2IEcStore> stores = new ArrayList<>();
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
				
			sql.append("select ec_store_id, ec_store_type, store_name, status from c2i_ec_store where company_id=?");
			pvs.add(companyId);
		
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				C2IEcStore c2iEcStore = new C2IEcStore();
				c2iEcStore.setEcStoreId(rs.getInt("ec_store_id"));
//				c2iEcStore.setEcStoreType(ECType.getEnum(rs.getString("ec_store_type")));
				c2iEcStore.setStoreName(rs.getString("store_name"));
				c2iEcStore.setStatus(rs.getString("status"));
				c2iEcStore.setDateCreated(rs.getString("date_created"));				
				stores.add(c2iEcStore);
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getStores function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		return stores;
	}
	
	
	public C2IEcDashboard getDashboardDetails(C2IEcDashboard c2iEcDashboard) throws SQLException {
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
				
			sql.append("select * from c2i_ec_dashboard where ec_id=?");
			pvs.add(c2iEcDashboard.getEcId());
		
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				
				c2iEcDashboard.setEcName(rs.getString("ec_name"));
				c2iEcDashboard.setTotalProducts(rs.getInt("total_products"));
				c2iEcDashboard.setTotalActiveProducts(rs.getInt("total_active_products"));
				c2iEcDashboard.setTotalOutOfStockProducts(rs.getInt("total_out_of_stock_products"));
				c2iEcDashboard.setTotalOrderValues(rs.getDouble("total_order_values"));
				c2iEcDashboard.setLastOrderValue(rs.getDouble("last_order_value"));
				c2iEcDashboard.setTotalReturns(rs.getInt("total_returns"));
				c2iEcDashboard.setTotalOrdersCount(rs.getInt("total_orders_count"));
				c2iEcDashboard.setDateUpdated(rs.getString("date_updated"));
				
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getStore function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		
		return c2iEcDashboard;
	}
	
	public int insertBrandDetails(C2IEcSellerBrand brand) throws SQLException {
		System.out.println("Inside Dao");
		PreparedStatement stmt = null;
		int sellerBrandId=0;
		ResultSet rs = null;
		
		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: INSERTING BRAND DETAILS");
		Connection conn = getConnection();
		
		StringBuilder sql;
		try {
			sql = new StringBuilder();
			
			sql.append("insert into c2i_ec_seller_brand(company_id,vertical,warranty_tenure,brand_name,brand_logo")
			.append(",brand_website_link,current_marketplace,sample_mrp_tag_image,seller_is_brand_owner,document_name ")
			.append(",document_type,document_data) ")
			.append("values(?,?,?,?,?,?,?,?,?,?,?,?) returning seller_brand_id");
			
			stmt = conn.prepareStatement(sql.toString());
					
			List<Object> paramValues = new ArrayList<Object>();
		
			paramValues.add(loggedInUser.getCompanyId());
			paramValues.add(brand.getVertical());
			paramValues.add(brand.getWarrantyTenure());
			paramValues.add(brand.getBrandName());
			paramValues.add(brand.getBrandLogo());
			paramValues.add(brand.getBrandWebsiteLink());
			paramValues.add(brand.getCurrentMarketplace());
			paramValues.add(brand.getSampleMrpTagImage());
			paramValues.add(brand.getSellerIsBrandOwner());
			paramValues.add(brand.getDocumentName());
			paramValues.add(brand.getDocumentType());
			paramValues.add(brand.getDocumentData());
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			if(rs.next()) {
				sellerBrandId= rs.getInt("seller_brand_id");
				brand.setSellerBrandId(sellerBrandId);
			}
			
		} catch (Exception e) {
			slf4jLogger.error("inserting brand error details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		System.out.println(sellerBrandId);
		return sellerBrandId;
	}
	
	public boolean approveBrand(Map<String,String> brand) throws SQLException {
		PreparedStatement stmt = null;
		boolean approval=false;
		ResultSet rs = null;
		
		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: CHECKING BRAND");
		Connection conn = getConnection();
		
		StringBuilder sql;
		try {
			sql = new StringBuilder();
			
			sql.append("SELECT EXISTS(select * from c2i_ec_seller_brand where company_id=? and vertical=? and brand_name=?)");
			
			stmt = conn.prepareStatement(sql.toString());
						
			List<Object> paramValues = new ArrayList<Object>();	
			paramValues.add(loggedInUser.getCompanyId());
			if(brand.containsKey("vertical")) {
				paramValues.add(brand.get("vertical"));
			}
			if(brand.containsKey("brand")) {
				paramValues.add(brand.get("brand"));
			}
			DBUtility.mapParams(stmt, paramValues);
		
			rs=stmt.executeQuery();
			if(rs.next()) {
				if(rs.getBoolean("exists")==true) {
					approval=true;			
				}
				
			}
			
		} catch (Exception e) {
			slf4jLogger.error("brand approval error details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return approval;
	}
	
	public int insertProduct(C2IEcProduct product) throws Exception {
		PreparedStatement stmt = null;
		int ecProdId=0;
		ResultSet rs = null;
	
//		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: INSERTING NEW EC PRODUCT");
		Connection conn = getConnection();
		
		StringBuilder sql;
		try {
			sql = new StringBuilder();
			sql.append("insert into c2i_ec_product(ec_store_id,product_name,brand,main_category,category1,category2")
				.append(",package_length,package_breadth,package_height,package_weight,tax_code,manufacturer_details")
				.append(",importer_details,packer_details,country_of_origin,manufacturing_date,shelf_life")
				.append(",product_specifications,additional_details) ")
				.append("values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) returning ec_prod_id");
			
			stmt = conn.prepareStatement(sql.toString());
						
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(product.getEcStoreId());
//			paramValues.add(product.getCompanyId());
			
			paramValues.add(product.getProductName());
			paramValues.add(product.getBrand());
			
			paramValues.add(product.getMainCategory());
			paramValues.add(product.getCategory1());
			paramValues.add(product.getCategory2());
		
			paramValues.add(product.getPackageLength());
			paramValues.add(product.getPackageBreadth());
			paramValues.add(product.getPackageHeight());
			paramValues.add(product.getPackageWeight());
			
			paramValues.add(product.getTaxCode());
			
			paramValues.add(product.getManufacturerDetails());
			paramValues.add(product.getImporterDetails());
			paramValues.add(product.getPackerDetails());
			paramValues.add(product.getCountryOfOrigin());
			
			paramValues.add(product.getManufacturingDate());
			paramValues.add(product.getShelfLife());
				
			PGobject pg = new PGobject();
			pg.setType("jsonb");
			pg.setValue(new Gson().toJson(product.getProductSpecifications()));
			paramValues.add(pg);
			
			PGobject pg2 = new PGobject();
			pg2.setType("jsonb");
			pg2.setValue(new Gson().toJson(product.getAdditionalDetails()));
			paramValues.add(pg2);
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			while(rs.next()) {
				ecProdId = rs.getInt("ec_prod_id");
				product.setEcProdId(ecProdId);
			}
			
		} catch (Exception e) {
			slf4jLogger.error("insert product details ", e);
			e.printStackTrace();

		}
		
		try {
			
			List<ECType> ecStoreTypes = product.getEcStoreTypes();
			for(ECType ecStoreType : ecStoreTypes) {
				sql= new StringBuilder();
				sql.append("insert into c2i_ec_product_selling_info(ec_prod_id,sku,product_id,product_id_type,category_id")
					.append(",listing_status,mrp,selling_price,stock,stock_available_for_buyers")
					.append(",hsn,luxury_cess,fullfilment_by,procurement_type,procurement_sla,shipping_provider")
					.append(",local_delivery_charge,zonal_delivery_charge,national_delivery_charge,ec_store_type) ")
					.append("values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) returning ec_prod_si_id");
				
				stmt = conn.prepareStatement(sql.toString());
							
				List<Object> paramValues = new ArrayList<Object>();	
				
				paramValues.add(product.getEcProdId());
//				paramValues.add(product.getCompanyId());
				
				paramValues.add(product.getSku());
				paramValues.add(product.getProductId());
				paramValues.add(product.getProductIdType());
				paramValues.add(product.getCategoryId());
				
				paramValues.add(product.getSellingInfo().getListingStatus());
				paramValues.add(product.getSellingInfo().getMrp());
				paramValues.add(product.getSellingInfo().getSellingPrice());

				paramValues.add(product.getStock());
				paramValues.add(product.getStockAvailableForBuyers());
				
				paramValues.add(product.getHsn());
				paramValues.add(product.getLuxuryCess());
				
				paramValues.add(product.getSellingInfo().getFullfilmentBy());
				paramValues.add(product.getSellingInfo().getProcurementType());
				paramValues.add(product.getSellingInfo().getProcurementSla());
				paramValues.add(product.getSellingInfo().getShippingProvider());
				paramValues.add(product.getSellingInfo().getLocalDeliveryCharge());
				paramValues.add(product.getSellingInfo().getZonalDeliveryCharge());
				paramValues.add(product.getSellingInfo().getNationalDeliveryCharge());
				
				paramValues.add(ecStoreType.toString());
				
				DBUtility.mapParams(stmt, paramValues);
				
				rs=stmt.executeQuery();
				while(rs.next()) {
					int ecProdSiId = rs.getInt("ec_prod_si_id");
					product.getSellingInfo().setEcProdSiId(ecProdSiId);
				}
				
			}
		} catch (Exception e) {
			slf4jLogger.error("insert product selling info ", e);
			e.printStackTrace();

		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
			
		return ecProdId;
	}
	
	public int insertFKProductIds(List<C2IEcProduct> c2iEcProducts) throws SQLException {
		PreparedStatement stmt = null;
		int rows=0;
		ResultSet rs = null;
		
//		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: INSERTING FLIPKART PRODUCT ID");
		Connection conn = getConnection();
		
		StringBuilder sql;
		try {
			for(C2IEcProduct c2iEcProduct: c2iEcProducts) {
				sql = new StringBuilder();
				sql.append("update c2i_ec_product_selling_info set product_id=? where sku=?");
				
				stmt = conn.prepareStatement(sql.toString());
				
				List<Object> paramValues = new ArrayList<Object>();	
				
				paramValues.add(c2iEcProduct.getProductId());
				paramValues.add(c2iEcProduct.getSku());
			
				DBUtility.mapParams(stmt, paramValues);
				
				rows+=stmt.executeUpdate();

			}	
		} catch (Exception e) {
			slf4jLogger.error("create store details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return rows;
	}
	
	
	public List<C2IEcProductImage> getProductImages(C2IEcProductImage image) throws SQLException {
		List<C2IEcProductImage> productImages =  new ArrayList<C2IEcProductImage>();
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
			
			if(image.getEcProdId()!=0) {
				sql.append("select * from c2i_ec_product_images where ec_prod_id=?");
				pvs.add(image.getEcProdId());
			}
	
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				image= new C2IEcProductImage();
				
				image.setEcImageId(rs.getInt("ec_image_id"));
				image.setEcProdId(rs.getInt("ec_prod_id"));
				image.setImageName(rs.getString("filename"));
				image.setImageType(rs.getString("image_type"));
				image.setView(rs.getString("view"));
				image.setImageData(rs.getBytes("document_data"));
				
				productImages.add(image);
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getProductImages function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		
		return productImages;
	}
	
	
	public String insertProductImages(C2IEcProductImage c2iEcProductImage) throws SQLException {
		PreparedStatement stmt = null;
		int rows=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: INSERTING EC PRODUCT IMAGES");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("insert into c2i_ec_product_images(ec_prod_id,filename,image_type,view,image_data) ")
				.append("values(?,?,?,?,?) returning ec_image_id");
			
			stmt = conn.prepareStatement(sql.toString());
			
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(c2iEcProductImage.getEcProdId());
			paramValues.add(c2iEcProductImage.getImageName());
			paramValues.add(c2iEcProductImage.getImageType());
			paramValues.add(c2iEcProductImage.getView());
			paramValues.add(c2iEcProductImage.getImageData());
		
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			while(rs.next()) {
				c2iEcProductImage.setEcImageId(rs.getInt("ec_image_id"));
				rows++;
			}
		} catch (Exception e) {
			slf4jLogger.error("insert product image details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ""+rows;
	}
	
	
	public int updateProductImages(C2IEcProductImage c2iEcProductImage) throws SQLException {
		PreparedStatement stmt = null;
		int status=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: UPDATING EC PRODUCT IMAGES");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("update c2i_ec_product_images set filename=?,image_type=?,image_data=?) ")
				.append("where ec_prod_id=? and view=?");
			
			stmt = conn.prepareStatement(sql.toString());
			
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(c2iEcProductImage.getImageName());
			paramValues.add(c2iEcProductImage.getImageType());
			paramValues.add(c2iEcProductImage.getImageData());
		
			DBUtility.mapParams(stmt, paramValues);
			
			status=stmt.executeUpdate();
		} catch (Exception e) {
			slf4jLogger.error(" update product image details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return status;
	}
	
	
	public String updateProduct(C2IEcProduct product) throws Exception {
		PreparedStatement stmt = null;
		int status=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: UPDATING EC PRODUCT");
		User loggedInUser  = C2IUtils.getLoggedInUser();

		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("update c2i_ec_product_selling_info set ec_prod_id=?,sku=?,product_id=?,product_id_type=?")
			.append(",category_id=?,listing_status=?,mrp=?,selling_price=?,stock=?,stock_available_for_buyers=?")
			.append(",hsn=?,luxury_cess=?,fullfilment_by=?,procurement_type=?,procurement_sla=?,shipping_provider=?")
			.append(",local_delivery_charge=?,zonal_delivery_charge=?,national_delivery_charge=?,ec_store_type=?")
			.append(" where ec_prod_si_id=?");
			
			List<Object> paramValues = new ArrayList<Object>();
			
			paramValues.add(product.getEcProdId());
//			paramValues.add(loggedInUser.getCompanyId());
			
			paramValues.add(product.getSku());
			paramValues.add(product.getProductId());
			paramValues.add(product.getProductIdType());
			
			paramValues.add(product.getCategoryId());
			
			paramValues.add(product.getSellingInfo().getListingStatus());
			paramValues.add(product.getSellingInfo().getMrp());
			paramValues.add(product.getSellingInfo().getSellingPrice());
			
			paramValues.add(product.getStock());
			paramValues.add(product.getStockAvailableForBuyers());
			paramValues.add(product.getHsn());
			paramValues.add(product.getLuxuryCess());
			
			paramValues.add(product.getSellingInfo().getFullfilmentBy());
			paramValues.add(product.getSellingInfo().getProcurementType());
			paramValues.add(product.getSellingInfo().getProcurementSla());
			paramValues.add(product.getSellingInfo().getShippingProvider());
			paramValues.add(product.getSellingInfo().getLocalDeliveryCharge());
			paramValues.add(product.getSellingInfo().getZonalDeliveryCharge());
			paramValues.add(product.getSellingInfo().getNationalDeliveryCharge());
			
			paramValues.add(product.getEcStoreTypes().get(0).toString());
			
			paramValues.add(product.getSellingInfo().getEcProdSiId());
			
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, paramValues);
			
			status=stmt.executeUpdate();
			
		} catch (Exception e) {
			slf4jLogger.error("update product details ", e);
			e.printStackTrace();

		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ""+status;
	}
	
	
	public String updateProductPrice(C2IEcProduct product) throws Exception {
		PreparedStatement stmt = null;
		int status=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: UPDATING EC PRODUCT");
		User loggedInUser  = C2IUtils.getLoggedInUser();

		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("update c2i_ec_product_selling_info set selling_price=? where ec_prod_si_id=?");
			
			List<Object> paramValues = new ArrayList<Object>();
			
			paramValues.add(product.getSellingInfo().getSellingPrice());
			
			paramValues.add(product.getSellingInfo().getEcProdSiId());
			
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, paramValues);
			
			status=stmt.executeUpdate();
			
		} catch (Exception e) {
			slf4jLogger.error("update product price details ", e);
			e.printStackTrace();

		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ""+status;
	}
	
	public String updateProductInventory(C2IEcProduct product) throws Exception {
		PreparedStatement stmt = null;
		int status=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: UPDATING EC PRODUCT");
		User loggedInUser  = C2IUtils.getLoggedInUser();

		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("update c2i_ec_product_selling_info set stock=? where ec_prod_si_id=?");
			
			List<Object> paramValues = new ArrayList<Object>();
			
			paramValues.add(product.getStock());
			
			paramValues.add(product.getSellingInfo().getEcProdSiId());
			
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, paramValues);
			
			status=stmt.executeUpdate();
			
		} catch (Exception e) {
			slf4jLogger.error("update product inventory details ", e);
			e.printStackTrace();

		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return ""+status;
	}
	
	
	public List<C2IEcProduct> getProducts(C2IEcProduct product) throws SQLException{
		PreparedStatement stmt = null;
		ResultSet rs = null;
		List<C2IEcProduct> c2iEcProducts = new ArrayList<C2IEcProduct>();
		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
			
			if(product.getEcStoreId()!=0) {
				sql.append("select * from c2i_ec_product cep, c2i_ec_product_selling_info cepsi")
					.append(" where cep.ec_prod_id = cepsi.ec_prod_id and ec_store_id=?");
				
				pvs.add(product.getEcStoreId());
			}
			
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				product = new C2IEcProduct();
				C2IEcProdSellingInfo si = new C2IEcProdSellingInfo();
				
				si.setEcProdSiId(rs.getInt("ec_prod_si_id"));
				product.setEcProdId(rs.getInt("ec_prod_id"));
				product.setSku(rs.getString("sku"));
				product.setProductId(rs.getString("product_id"));
				product.setProductIdType(rs.getString("product_id_type"));
				product.setEcStoreId(rs.getInt("ec_store_id"));
				product.setProductName(rs.getString("product_name"));
				product.setBrand(rs.getString("brand"));
				product.setCategoryId(rs.getString("category_id"));
				product.setCategory1(rs.getString("category1"));
				product.setCategory2(rs.getString("category2"));
				product.setMainCategory(rs.getString("main_category"));
				si.setListingStatus(rs.getString("listing_status"));
				si.setMrp(rs.getInt("mrp"));
				si.setSellingPrice(rs.getInt("selling_price"));
				product.setStock(rs.getInt("stock"));
				product.setHsn(rs.getString("hsn"));
				product.setLuxuryCess(rs.getString("luxury_cess"));
				product.setTaxCode(rs.getString("tax_code"));
				si.setFullfilmentBy(rs.getString("fullfilment_by"));
				si.setProcurementType(rs.getString("procurement_type"));
				si.setProcurementSla(rs.getInt("procurement_sla"));
				si.setShippingProvider(rs.getString("shipping_provider"));
				si.setLocalDeliveryCharge(rs.getDouble("local_delivery_charge"));
				si.setZonalDeliveryCharge(rs.getDouble("zonal_delivery_charge"));
				si.setNationalDeliveryCharge(rs.getDouble("national_delivery_charge"));
				product.setManufacturerDetails(rs.getString("manufacturer_details"));
				product.setImporterDetails(rs.getString("importer_details"));
				product.setPackerDetails(rs.getString("importer_details"));
				product.setCountryOfOrigin(rs.getString("country_of_origin"));
				product.setSellingInfo(si);
				product.setProductSpecifications(new Gson().fromJson(rs.getObject("product_specifications").toString(), HashMap.class));
				product.setAdditionalDetails(new Gson().fromJson(rs.getObject("additional_details").toString(), HashMap.class));
				product.setEcStoreTypes(Arrays.asList(ECType.getEnum(rs.getString("ec_store_type"))));
				
				c2iEcProducts.add(product);
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getProducts function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		
		return c2iEcProducts;
	}
	
	
	public C2IEcProduct getProductDetails(C2IEcProduct c2iEcProduct) throws SQLException{
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
			
			if(c2iEcProduct.getSellingInfo().getEcProdSiId()!=0) {
				sql.append("select * from c2i_ec_product cep, c2i_ec_product_selling_info cepsi")
				.append(" where cep.ec_prod_id = cepsi.ec_prod_id and cepsi.ec_prod_si_id=?");
				pvs.add(c2iEcProduct.getSellingInfo().getEcProdSiId());
			}
	
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				C2IEcProdSellingInfo si = new C2IEcProdSellingInfo();
				
				si.setEcProdSiId(rs.getInt("ec_prod_si_id"));
				c2iEcProduct.setEcProdId(rs.getInt("ec_prod_id"));
				c2iEcProduct.setSku(rs.getString("sku"));
				c2iEcProduct.setProductId(rs.getString("product_id"));
				c2iEcProduct.setProductIdType(rs.getString("product_id_type"));
				c2iEcProduct.setEcStoreId(rs.getInt("ec_store_id"));
				c2iEcProduct.setProductName(rs.getString("product_name"));
				c2iEcProduct.setBrand(rs.getString("brand"));
				c2iEcProduct.setCategoryId(rs.getString("category_id"));
				c2iEcProduct.setMainCategory(rs.getString("main_category"));
				c2iEcProduct.setCategory1(rs.getString("category1"));
				c2iEcProduct.setCategory2(rs.getString("category2"));
				c2iEcProduct.setPackageLength(rs.getDouble("package_length"));
				c2iEcProduct.setPackageBreadth(rs.getDouble("package_breadth"));
				c2iEcProduct.setPackageHeight(rs.getDouble("package_height"));
				c2iEcProduct.setPackageWeight(rs.getDouble("package_weight"));
				si.setListingStatus(rs.getString("listing_status"));
				si.setMrp(rs.getInt("mrp"));
				si.setSellingPrice(rs.getInt("selling_price"));
				c2iEcProduct.setStock(rs.getInt("stock"));
				c2iEcProduct.setHsn(rs.getString("hsn"));
				c2iEcProduct.setLuxuryCess(rs.getString("luxury_cess"));
				c2iEcProduct.setTaxCode(rs.getString("tax_code"));
				si.setFullfilmentBy(rs.getString("fullfilment_by"));
				si.setProcurementType(rs.getString("procurement_type"));
				si.setProcurementSla(rs.getInt("procurement_sla"));
				si.setShippingProvider(rs.getString("shipping_provider"));
				si.setLocalDeliveryCharge(rs.getDouble("local_delivery_charge"));
				si.setZonalDeliveryCharge(rs.getDouble("zonal_delivery_charge"));
				si.setNationalDeliveryCharge(rs.getDouble("national_delivery_charge"));
				c2iEcProduct.setManufacturerDetails(rs.getString("manufacturer_details"));
				c2iEcProduct.setImporterDetails(rs.getString("importer_details"));
				c2iEcProduct.setPackerDetails(rs.getString("importer_details"));
				c2iEcProduct.setCountryOfOrigin(rs.getString("country_of_origin"));
				c2iEcProduct.setSellingInfo(si);
				c2iEcProduct.setProductSpecifications(new Gson().fromJson(rs.getObject("product_specifications").toString(), HashMap.class));
				c2iEcProduct.setAdditionalDetails(new Gson().fromJson(rs.getObject("additional_details").toString(), HashMap.class));
				c2iEcProduct.setEcStoreTypes(Arrays.asList(ECType.getEnum(rs.getString("ec_store_type"))));
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getProductDetails function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		
		return c2iEcProduct;
	}
	
	
	public Map<Long, List<C2IEcProduct>> getProductSKUs(long storeId, ECType type, long companyId) throws Exception{
		PreparedStatement stmt = null;
		ResultSet rs = null;
		Map<Long, List<C2IEcProduct>> skuMap = new HashMap<>();
		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
			sql.append("select ec_store_id, sku,ec_store_type from c2i_ec_product where company_id = ?");
			pvs.add(companyId);
			
			if(storeId > 0) {
				sql.append(" and ec_store_type ilike ? ");
				pvs.add(type.name());
			}
			
			if(type != null) {
				sql.append(" and ec_store_id =? ");
				pvs.add(storeId);
			}
			
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);

			rs = stmt.executeQuery();
			
			while (rs.next()) {
				ECType ctype = ECType.getEnum(rs.getString("ec_store_type"));
				long sid = rs.getLong("ec_store_id");
				List<C2IEcProduct> skus = skuMap.get(sid);
				if(skus == null) {
					skus = new ArrayList<>();
					skuMap.put(sid, skus);
				}
				C2IEcProduct cp = new C2IEcProduct();
				cp.setSku(rs.getString("sku"));
//				cp.setEcStoreTypes(ctype);
				skus.add(cp);
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getProductSKus function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
		
		return skuMap;
	}
	
	
	public Map<String, Object> getProductForms(Map<String, String> categories) throws SQLException{
		PreparedStatement stmt = null;
		ResultSet rs = null;
		Map<String, Object> productForms = new HashMap<String, Object>();
		Object form1,form2, form3;
//		Map<String, Object> productForm1= new HashMap<String, Object>();
		Map<String, Object> productForm2= new HashMap<String, Object>();
		Map<String, Object> productForm3= new HashMap<String, Object>();

		
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			List<Object> pvs = new ArrayList<Object>();
			
			sql.append("select * from c2i_ec_product_category where main_category=? and category1=? and category2=?");
			pvs.add(categories.get("mainCategory"));
			pvs.add(categories.get("category1"));
			pvs.add(categories.get("category2"));
			
			stmt = conn.prepareStatement(sql.toString());
			DBUtility.mapParams(stmt, pvs);
			rs = stmt.executeQuery();
			
			while (rs.next()) {
				
//				form1= rs.getObject("ui_form_meta1");
				form2= rs.getObject("ui_form_meta2");
				form3= rs.getObject("ui_form_meta3");

//				productForm1=(new Gson().fromJson(form1.toString(), HashMap.class));
				productForm2=(new Gson().fromJson(form2.toString(), HashMap.class));
				productForm3=(new Gson().fromJson(form3.toString(), HashMap.class));

//				productForms.put("uiFormMeta1", productForm1.get("meta_data"));
				productForms.put("uiFormMeta2", productForm2.get("meta_data"));
				productForms.put("uiFormMeta3", productForm3.get("meta_data"));
				
//				productForms.put("uiFormMeta1", rs.getObject("ui_form_meta1"));
//				productForms.put("uiFormMeta2", rs.getObject("ui_form_meta2"));
//				productForms.put("uiFormMeta3", rs.getObject("ui_form_meta3"));
				
			}

		} catch (Exception e) {
			slf4jLogger.error("Error in getDetailedProducts function", e);
			e.printStackTrace();
		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (conn != null) {
				conn.close();
			}
		}
			
		return productForms;
	}
	
	
	
	public String insertOrderDetails(JSONObject orderDetails) throws Exception {
		PreparedStatement stmt = null;
		int rows=0;
		ResultSet rs = null;
		String storeId="",companyId="";
	
//		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: INSERTING NEW EC ORDER DETAILS");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			sql.append("select ec_store_id,company_id from c2i_ec_product where product_id=?");
			
			stmt = conn.prepareStatement(sql.toString());
			List<Object> paramValues = new ArrayList<Object>();	
			paramValues.add(orderDetails.getJSONObject("attributes").getJSONArray("orderItems").getJSONObject(0).get("fsn"));
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			while(rs.next()) {
				storeId = rs.getString("ec_store_id");
				companyId= rs.getString("companyId");
			}
			
			StringBuilder sql2 = new StringBuilder();
			sql2.append("insert into c2i_ec_order(ec_store_id,shipment_id,order_details,company_id,order_amount,taxes")
			.append(",total_order_amount) values(?,?,?,?,?,?) returning c2i_order_id");			
			stmt = conn.prepareStatement(sql2.toString());
					
			paramValues.clear();
//			paramValues = new ArrayList<Object>();	
			
			paramValues.add(storeId);
			paramValues.add(orderDetails.get("shipmentId"));
			
			PGobject pg = new PGobject();
			pg.setType("jsonb");
			pg.setValue(new Gson().toJson(orderDetails));
			paramValues.add(pg);
			
			paramValues.add(companyId);
			paramValues.add("");
			paramValues.add("");
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			int c2iOrderId=0;
			while(rs.next()) {
				c2iOrderId = rs.getInt("c2i_order_id");
				rows++;
			}
		}catch (Exception e) {
			slf4jLogger.error("insert order details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return "" + rows;
	}
	
	
	public String insertOrderItemDetails(JSONObject orderDetails) throws SQLException {
		PreparedStatement stmt = null;
		int rows=0;
		ResultSet rs = null;
		String storeId="",companyId="",c2iOrderId="";
	
//		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: INSERTING NEW EC ORDER DETAILS");
		Connection conn = getConnection();
		try {
			
			StringBuilder sql = new StringBuilder();
			
			sql.append("select c2i_order_id,ec_store_id,company_id from c2i_ec_order where shipment_id=? limit 1 returning order_item_id");
			
			stmt = conn.prepareStatement(sql.toString());
			List<Object> paramValues = new ArrayList<Object>();	
			paramValues.add(orderDetails.get("shipmentId"));
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			while(rs.next()) {
				c2iOrderId = rs.getString("c2i_ec_order_id");
				storeId = rs.getString("ec_store_id");
				companyId= rs.getString("companyId");
			}
			
			StringBuilder sql2 = new StringBuilder();
			
			List<String> orderItemIds = new ArrayList<String>();
			int len = orderDetails.getJSONObject("attributes").getJSONArray("orderItems").length();
			
			for(int i=0;i<len;i++ ) {
				
				sql2.append("insert into c2i_ec_order_item(c2i_order_id,order_id,product_id,store_id,quantity,taxes,amount) ")
				.append("values(?,?,?,?,?,?) returning order_item_id");			
				stmt = conn.prepareStatement(sql2.toString());
							
				paramValues.clear();
				
				paramValues.add(c2iOrderId);
				paramValues.add(orderDetails.getJSONObject("attributes").getJSONArray("orderItems").getJSONObject(i).get("orderId"));
				paramValues.add(orderDetails.getJSONObject("attributes").getJSONArray("orderItems").getJSONObject(i).get("fsn"));
				paramValues.add(storeId);
				paramValues.add("");
				paramValues.add("");
				paramValues.add("");
				
				DBUtility.mapParams(stmt, paramValues);
				rs=stmt.executeQuery();
				String ordetItemId;
				while(rs.next()) {
					ordetItemId = rs.getString("ordet_item_id");
					orderItemIds.add(ordetItemId);
					rows++;
				}
			}
		}catch (Exception e) {
			slf4jLogger.error("insert order details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return "" + rows;
		
	}
	
	public Map<String, Object> getOrderDetails(String orderId) throws SQLException {
		PreparedStatement stmt = null;
		int rows=0;
		ResultSet rs = null;
		Map<String,Object> orderDetails = new HashMap<String,Object>();
	
//		User loggedInUser  = C2IUtils.getLoggedInUser();
		slf4jLogger.info("LOCAL-DATA: GETTING EC ORDER DETAILS");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			
			sql.append("select order_details from c2i_ec_order where order_id=?");
			
			stmt = conn.prepareStatement(sql.toString());
			List<Object> paramValues = new ArrayList<Object>();	
			paramValues.add(orderId);
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			while(rs.next()) {
				Object od = rs.getObject("order_details");
				PGobject pgo = (PGobject) od;
				orderDetails = new Gson().fromJson(pgo.getValue(), HashMap.class);
				rows++;
			}
			
		} catch (Exception e) {
			slf4jLogger.error("getting order details error ", e);
			e.printStackTrace();

		} finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return orderDetails;
	}
	public int insertInquiryDetails(InquiryDetails sid) throws SQLException {
		PreparedStatement stmt = null;
		int inquiry_details_id=0;
		ResultSet rs = null;
		
		slf4jLogger.info("LOCAL-DATA: INSERTING SELLER DETAILS");
		Connection conn = getConnection();
		
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("insert into inquiry_details(user_id,trade_type,mode,incoterms,pickup,pol")
				.append("pod,delivery,pickup_service,origin_handling,origin_cha,delivery_service,destination_handling" )
				.append("destination_cha,gross_weight,gross_weight_unit,commodity,cargo_type,expected_pickup_date")
				.append("lcl_package_quantity,lcl_package_type,fcl_container_quantity,fcl_container_type,fcl_container_size")
				.append("fcl_container_stuffing,length,width,height,quantity,unit,air_load_type,special_instruction")
				.append("values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) returning inquiry_details_id");
			
			stmt = conn.prepareStatement(sql.toString());
	
			User loggedInUser  = C2IUtils.getLoggedInUser();
			
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(loggedInUser.getUserId());
			paramValues.add(sid.getTrade_type());
			paramValues.add(sid.getMode());
			paramValues.add(sid.getIncoterms());
			paramValues.add(sid.getPickup());
			paramValues.add(sid.getPol());
			paramValues.add(sid.getPod());
			paramValues.add(sid.getDelivery());
			paramValues.add(sid.getPickup_service());
			paramValues.add(sid.getOrigin_handling());
			paramValues.add(sid.getOrigin_cha());
			paramValues.add(sid.getDelivery_service());
			paramValues.add(sid.getDestination_handling());
			paramValues.add(sid.getDestination_cha());
			paramValues.add(sid.getGross_weight());
			paramValues.add(sid.getGross_weight_unit());
			paramValues.add(sid.getCommodity());
			paramValues.add(sid.getCargo_type());
			paramValues.add(sid.getExpected_pickup_date());
			paramValues.add(sid.getLcl_package_quantity());
			paramValues.add(sid.getLcl_package_type());
			paramValues.add(sid.getFcl_container_quantity());
			paramValues.add(sid.getFcl_container_type());
			paramValues.add(sid.getFcl_container_size());
			paramValues.add(sid.getFcl_container_stuffing());
			paramValues.add(sid.getLength());
			paramValues.add(sid.getWidth());
			paramValues.add(sid.getHeight());
			paramValues.add(sid.getQuantity());
			paramValues.add(sid.getUnit());
			paramValues.add(sid.getAir_load_type());
			paramValues.add(sid.getSpecial_instruction());
			Set<String> marketplaces = new HashSet<>();
			
			
			paramValues.add(StringUtils.join(marketplaces, ","));			
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			
			while(rs.next()) {
				inquiry_details_id = rs.getInt("inquiry_details_id");
				sid.setInquiry_details_id(inquiry_details_id);
			}
		} catch (Exception e) {
			slf4jLogger.error("inserting seller details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return inquiry_details_id;
	}
	public InquiryDetails getInquiryDetails(int inquiry_details_id) throws SQLException {
		PreparedStatement stmt = null;
		InquiryDetails idt=new InquiryDetails();
		ResultSet rs = null;
		
		slf4jLogger.info("LOCAL-DATA: INSERTING SELLER DETAILS");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("select * from c2i_ec_seller where user_id=? and inquiry_details_id=?");
			
			stmt = conn.prepareStatement(sql.toString());
	
			User loggedInUser  = C2IUtils.getLoggedInUser();
			
			List<Object> paramValues = new ArrayList<Object>();	
		
			paramValues.add(loggedInUser.getUserId());
			
			DBUtility.mapParams(stmt, paramValues);
			
			rs=stmt.executeQuery();
			
			while(rs.next()) {
				idt.setTrade_type(rs.getString("trade_type"));
				idt.setMode(rs.getString("mode"));
				idt.setIncoterms(rs.getString("incoterms"));
				idt.setPickup(rs.getString("pickup"));
				idt.setPol(rs.getString("pol"));
				idt.setPod(rs.getString("pod"));
				idt.setDelivery(rs.getString("delivery"));
				idt.setPickup_service(rs.getString("pickup_service"));
				idt.setOrigin_handling(rs.getString("origin_handling"));
				idt.setOrigin_cha(rs.getString("origin_cha"));
				idt.setDelivery_service(rs.getString("delivery_service"));
				idt.setDestination_handling(rs.getString("destination_handling"));
				idt.setDestination_cha(rs.getString("destination_cha"));
				idt.setGross_weight(rs.getInt("gross_weight"));
				idt.setGross_weight_unit(rs.getString("gross_weight_unit"));
				idt.setCommodity(rs.getString("commodity"));
				idt.setCargo_type(rs.getString("cargo_type"));
				idt.setExpected_pickup_date(rs.getString("expected_pickup_date"));
				idt.setLcl_package_quantity(rs.getInt("lcl_package_quantity"));
				idt.setLcl_package_type(rs.getString("lcl_package_type"));
				idt.setFcl_container_quantity(rs.getInt("fcl_container_quantity"));;
				idt.setFcl_container_type(rs.getString("fcl_container_type"));
				idt.setFcl_container_size(rs.getString("fcl_container_size"));
				idt.setFcl_container_stuffing(rs.getString("fcl_container_stuffing"));
				idt.setLength(rs.getInt("length"));
				idt.setWidth(rs.getInt("width"));
				idt.setHeight(rs.getInt("height"));
				idt.setQuantity(rs.getInt("quantity"));
				idt.setUnit(rs.getString("unit"));
				idt.setAir_load_type(rs.getString("air_load_type"));
				idt.setSpecial_instruction(rs.getString("special_instruction"));
				
			}
		} catch (Exception e) {
			slf4jLogger.error("inserting seller details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return idt;
	}
	public int updateInquiryDetails(InquiryDetails sid) throws SQLException {
		PreparedStatement stmt = null;
		int status=0;
		ResultSet rs = null;
		slf4jLogger.info("LOCAL-DATA: UPDATING EC PRODUCT IMAGES");
		Connection conn = getConnection();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("update inquiry_details set user_id=?,trade_type=?,mode=?,incoterms=?,pickup=?,pol=?")
				.append("pod=?,delivery=?,pickup_service=?,origin_handling=?,origin_cha=?,delivery_service=?,destination_handling=?" )
				.append("destination_cha=?,gross_weight=?,gross_weight_unit=?,commodity=?,cargo_type=?,expected_pickup_date=?")
				.append("lcl_package_quantity=?,lcl_package_type=?,fcl_container_quantity=?,fcl_container_type=?,fcl_container_size=?")
				.append("fcl_container_stuffing=?,length=?,width=?,height=?,quantity=?,unit=?,air_load_type=?,special_instruction=?");
			
			stmt = conn.prepareStatement(sql.toString());
			
			User loggedInUser  = C2IUtils.getLoggedInUser();
			
			List<Object> paramValues = new ArrayList<Object>();	
			
			paramValues.add(loggedInUser.getUserId());
			paramValues.add(sid.getTrade_type());
			paramValues.add(sid.getMode());
			paramValues.add(sid.getIncoterms());
			paramValues.add(sid.getPickup());
			paramValues.add(sid.getPol());
			paramValues.add(sid.getPod());
			paramValues.add(sid.getDelivery());
			paramValues.add(sid.getPickup_service());
			paramValues.add(sid.getOrigin_handling());
			paramValues.add(sid.getOrigin_cha());
			paramValues.add(sid.getDelivery_service());
			paramValues.add(sid.getDestination_handling());
			paramValues.add(sid.getDestination_cha());
			paramValues.add(sid.getGross_weight());
			paramValues.add(sid.getGross_weight_unit());
			paramValues.add(sid.getCommodity());
			paramValues.add(sid.getCargo_type());
			paramValues.add(sid.getExpected_pickup_date());
			paramValues.add(sid.getLcl_package_quantity());
			paramValues.add(sid.getLcl_package_type());
			paramValues.add(sid.getFcl_container_quantity());
			paramValues.add(sid.getFcl_container_type());
			paramValues.add(sid.getFcl_container_size());
			paramValues.add(sid.getFcl_container_stuffing());
			paramValues.add(sid.getLength());
			paramValues.add(sid.getWidth());
			paramValues.add(sid.getHeight());
			paramValues.add(sid.getQuantity());
			paramValues.add(sid.getUnit());
			paramValues.add(sid.getAir_load_type());
			paramValues.add(sid.getSpecial_instruction());
			Set<String> marketplaces = new HashSet<>();
			
			
			paramValues.add(StringUtils.join(marketplaces, ","));			
			
			DBUtility.mapParams(stmt, paramValues);
			
			status=stmt.executeUpdate();
		} catch (Exception e) {
			slf4jLogger.error(" update product image details ", e);
			e.printStackTrace();

		}finally {
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if(conn != null ) {
				conn.close();
			}
		}
		return status;
	}
	
}
