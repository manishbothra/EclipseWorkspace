package com.connect2.ec.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import javax.annotation.PostConstruct;

import org.apache.commons.collections.CollectionUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.connect2.ec.adapter.ec.am.service.AmazonEcomService;
import com.connect2.ec.adapter.ec.eb.service.EbayEcomService;
import com.connect2.ec.adapter.ec.fk.FlipkartEcommService;
import com.connect2.ec.constants.ECType;
import com.connect2.ec.controller.InquiryDetails;
import com.connect2.ec.dao.C2IEcommerceDao;
import com.connect2.ec.domain.C2IEcDashboard;
import com.connect2.ec.domain.C2IEcOrder;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.ec.domain.C2IEcProductImage;
import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.ec.domain.C2IEcSellerBrand;
import com.connect2.ec.domain.C2IEcShipment;
import com.connect2.ec.domain.C2IEcStore;
import com.connect2.ec.domain.C2IEcStoreDocs;

@Service
public class C2IEcommerceService {

	
	private final Logger logger = LoggerFactory.getLogger(C2IEcommerceService.class);

	@Autowired
	private C2IEcommerceDao c2iEcDao;
	
	@Autowired 
	private FlipkartEcommService fkService;
	
	@Autowired
	private AmazonEcomService amService;
	
	@Autowired
	private EbayEcomService ebayService;

	@Autowired
	private List<IEComService> ecommAdapters;

	private final Map<ECType, IEComService> ecomAdaptersCache = new HashMap<>();

	@PostConstruct
	public void registerECAdapters() {
		if (ecommAdapters != null) {
			try {
				for (IEComService stc : ecommAdapters) {
					ecomAdaptersCache.put(stc.getECType(), stc);
					logger.info("Registered {} adapter for ec {}", stc.getClass().getName(), stc.getECType());
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				logger.error("Error in registering ec adapters");
			}
		}
	}
	
	public IEComService getEcomAdapter(ECType type) {
		return ecomAdaptersCache.get(type);
	}
	
	public int insertSellerDetails(C2IEcSeller ecSeller) {
		int ecSellerId=0;
		try {
			ecSellerId = c2iEcDao.insertSellerDetails(ecSeller);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ecSellerId;
	}
	
	public Map<Long, List<C2IEcProduct>> getAllProductSkus(long companyId, long storeId, ECType type) throws Exception {
		return c2iEcDao.getProductSKUs(storeId, type, companyId);
	}
	
	@Async("pdAsyncExecutor")
	public CompletableFuture<List<C2IEcProduct>> getProductsFromOnlineStore(ECType ecType, List<String> skus) {
		List<C2IEcProduct> products = new ArrayList<C2IEcProduct>();
		products = getEcomAdapter(ecType).getProducts(skus);
		return CompletableFuture.completedFuture(products);
	} 
	
	public List<C2IEcStore> getBasicStores(long companyId) throws Exception {
		return c2iEcDao.getBasicStores(companyId);
	}
	
	public List<C2IEcStore> getDetailedStores(long companyId) throws Exception {
		return c2iEcDao.getDetailedStores(companyId);
	}
	
	public List<C2IEcProduct> getProductsFromAllOnlineStores(long companyId) throws Exception {
		List<C2IEcProduct> products = new ArrayList<C2IEcProduct>();
		Map<Long, List<C2IEcProduct>> skuProds = getAllProductSkus(companyId, -1, null);
		List<CompletableFuture<List<C2IEcProduct>>> completableJobs = new ArrayList<>();
		
//		List<C2IEcStore> stores = getBasicStores(companyId);
		
		for(long sid: skuProds.keySet()) {
			List<C2IEcProduct> cps = skuProds.get(sid);
			List<String> skus = new ArrayList<>();
			ECType type = null;
			if(!CollectionUtils.isEmpty(skus)) {
				for(C2IEcProduct c2iec: cps) {
					skus.add(c2iec.getSku());
//					type = c2iec.getEcStoreType();
				}
			}
			
			CompletableFuture<List<C2IEcProduct>> prods = getProductsFromOnlineStore(type, skus);
			completableJobs.add(prods);
		}
		
		CompletableFuture.allOf(completableJobs.toArray(new CompletableFuture[completableJobs.size()])).join();
		for(CompletableFuture<List<C2IEcProduct>> cf: completableJobs) {
			if(!CollectionUtils.isEmpty(cf.get())) {
				products.addAll(cf.get());
			}
		}
		
		return products;
	} 

	public List<C2IEcStore> getStoreDetails(C2IEcStore c2iEcStore) throws Exception {
		
		List<C2IEcStore> C2iEcStore = c2iEcDao.getDetailedStores(c2iEcStore.getCompanyId());
		return C2iEcStore;
	}

	public C2IEcSeller getSellerInfo() {
		return null;
	}

	public int createStore(C2IEcStore store) throws SQLException {
		int ecStoreId = c2iEcDao.createStore(store);
		return ecStoreId;
	}

	public String insertStoreDocs(C2IEcStoreDocs c2iEcStoreDocs) {
		String status="";
		try {
			status = c2iEcDao.insertStoreDocs(c2iEcStoreDocs);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return status;
	}
	
	public int insertFKProductsIds(C2IEcProduct criteria) {
		List<C2IEcProduct> c2iEcProducts = new ArrayList<C2IEcProduct>();		
		List<String> skus = new ArrayList<String>();
		int status=0;
		
		try {
			c2iEcProducts = c2iEcDao.getProducts(criteria);
			
			for(C2IEcProduct product : c2iEcProducts) {
				skus.add(product.getSku());
			}
			
			c2iEcProducts = fkService.getProducts(skus);
			
			status= c2iEcDao.insertFKProductIds(c2iEcProducts);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return status;
	}
	
	public C2IEcDashboard getDashBoardDetails(C2IEcDashboard c2iEcDashboard) throws SQLException {
		c2iEcDashboard = c2iEcDao.getDashboardDetails(c2iEcDashboard);
		return c2iEcDashboard;
	}

	public List<C2IEcProduct> getProducts(C2IEcProduct criteria) throws Exception {
		return getProducts(criteria, false);
	}

	public List<C2IEcProduct> getProducts(C2IEcProduct criteria, boolean refreshFromServer) throws Exception {
		List<C2IEcProduct> c2iEcProducts = new ArrayList<C2IEcProduct>();		
		if (!refreshFromServer) {
			c2iEcProducts = c2iEcDao.getProducts(criteria);
		} else {
			
//			fpService.getProducts();
		}

		return c2iEcProducts;
	}
	
	public C2IEcProduct getProductDetails(C2IEcProduct c2iEcProduct, boolean refreshFromServer) throws SQLException {
		if (!refreshFromServer) {
			c2iEcProduct = c2iEcDao.getProductDetails(c2iEcProduct);
		} else {
			// TODO fetch and update db from indv. ecom stores.
//			fpService.getProducts();
		}
		return c2iEcProduct;
	}

	public int insertBrandDetails(C2IEcSellerBrand brand){
		int sellerBrandId=0;
		try {
			sellerBrandId=c2iEcDao.insertBrandDetails(brand);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		System.out.println("sellerBrandId");
		return sellerBrandId;
	}
	
	public boolean approveBrand(Map<String,String> brand) {
		boolean approval=false;
		try {
			approval = c2iEcDao.approveBrand(brand);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return approval;
	}
	
	public Map<String, Object> insertProduct(C2IEcProduct product) throws Exception {

		Map<String, Object> resp = new HashMap<String, Object>();
		
		if(product.getEcStoreTypes().contains(ECType.FLIPKART)) {
			resp.put("fkstoreStatus", fkService.insertProduct(product));
		}
		if(product.getEcStoreTypes().contains(ECType.AMAZON)) {
			resp.put("amStoreStatus", amService.insertProduct(product));
		}
		if(product.getEcStoreTypes().contains(ECType.EBAY)) {
			resp.put("ebayStoreStatus", ebayService.insertProduct(product) );
		}
		resp.put("ecProdId", c2iEcDao.insertProduct(product));
		return resp;
	}

	public String insertProductImages(C2IEcProductImage c2iEcProductImage){
		String status="";
		try {
			status = c2iEcDao.insertProductImages(c2iEcProductImage);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return status;
	}
	
	public int updateProductImage(C2IEcProductImage image) {
		int status=0;
		try {
			status = c2iEcDao.updateProductImages(image);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return status;
	}
	
	public List<C2IEcProductImage> getProductImages(C2IEcProductImage image) {
		List<C2IEcProductImage> productImages= new ArrayList<C2IEcProductImage>();
		try {
			productImages=c2iEcDao.getProductImages(image);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return productImages;
	}
	
	
	public Map<String, Object> updateProduct(C2IEcProduct product) throws Exception {

		Map<String, Object> resp = new HashMap<String, Object>();
		resp.put("daoStatus", c2iEcDao.updateProduct(product));
		if(product.getEcStoreTypes().contains(ECType.FLIPKART)) {
			resp.put("fkstoreStatus", fkService.updateProduct(product));
		}
		if(product.getEcStoreTypes().contains(ECType.AMAZON)) {
			resp.put("amStoreStatus", amService.updateProduct(product));
		}
		if(product.getEcStoreTypes().contains(ECType.EBAY)) {
			resp.put("ebayStoreStatus", ebayService.updateProduct(product) );
		}
		return resp;
	}
	
	public Map<String, Object> updateProductPrice(C2IEcProduct product) throws Exception {
		Map<String, Object> resp = new HashMap<String, Object>();
		resp.put("daoStatus", c2iEcDao.updateProductPrice(product));
		if(product.getEcStoreTypes().contains(ECType.FLIPKART)) {
			resp.put("fkstoreStatus", fkService.updateProductPrice(product));
		}
		if(product.getEcStoreTypes().contains(ECType.AMAZON)) {
			resp.put("amStoreStatus", amService.updateProductPrice(product));
		}
		if(product.getEcStoreTypes().contains(ECType.EBAY)) {
			resp.put("ebayStoreStatus", ebayService.updateProduct(product) );
		}
		return resp;
	}

	public Map<String, Object> updateProductInventory(C2IEcProduct product) throws Exception {
		Map<String, Object> resp = new HashMap<String, Object>();
		resp.put("daoStatus", c2iEcDao.updateProductInventory(product));
		if(product.getEcStoreTypes().contains(ECType.FLIPKART)) {
			resp.put("fkstoreStatus", fkService.updateProductInventory(product));
		}
		if(product.getEcStoreTypes().contains(ECType.AMAZON)) {
			resp.put("amStoreStatus", amService.updateProductInventory(product));
		}
		if(product.getEcStoreTypes().contains(ECType.EBAY)) {
			resp.put("ebayStoreStatus", ebayService.updateProduct(product) );
		}
		return resp;
	}

	public Map<String, Object> getProductForms(Map<String,String> categories){
		Map<String, Object> productForms = new HashMap<String, Object>();
		try {
			productForms=c2iEcDao.getProductForms(categories);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return productForms;
		
	}
	
	public List<C2IEcOrder> getAllOrders() {
		return null;
	}

	public List<C2IEcOrder> getOrders(Date startDate, Date endDate) {
		return null;
	}

	public Map<String,Object> getOrderDetails(String orderId) {
		Map<String, Object> orderDetails = new HashMap<String, Object>();
		try {
			orderDetails = c2iEcDao.getOrderDetails(orderId);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return orderDetails;
	}

	public List<C2IEcShipment> searchShipment(List<C2IEcShipment> shipments) {
		shipments = fkService.searchShipment(shipments);
		return shipments;
	}

	public List<C2IEcShipment> generateLabel(List<C2IEcShipment> shipments) {
		shipments = fkService.generateLabel(shipments);
		return shipments;
	}

	public List<C2IEcShipment> markReadyToDispatch(List<C2IEcShipment> shipments) {
		shipments = fkService.markReadyToDispatch(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> cancelOrder(List<C2IEcShipment> shipments) {
		shipments = fkService.cancelOrder(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> markDelivered(List<C2IEcShipment> shipments) {
		shipments = fkService.markDelivered(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> markAttemptedDelivery(List<C2IEcShipment> shipments) {
		shipments = fkService.markAttemptedDelivery(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> markServiceCompleted(List<C2IEcShipment> shipments) {
		shipments = fkService.markServiceCompleted(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> markServiceAttempted(List<C2IEcShipment> shipments) {
		shipments = fkService.markServiceAttempted(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> approveReturns(List<C2IEcShipment> shipments) {
		shipments = fkService.approveReturns(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> rejectReturns(List<C2IEcShipment> shipments) {
		shipments = fkService.rejectReturns(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> completeReturns(List<C2IEcShipment> shipments) {
		shipments = fkService.completeReturns(shipments);
	
		return shipments;
	}

	public List<C2IEcShipment> pickupReturns(List<C2IEcShipment> shipments) {
		shipments = fkService.pickupReturns(shipments);
		
		return shipments;
	}

	public List<C2IEcShipment> pickupReturnsAttempted(List<C2IEcShipment> shipments) {
		shipments = fkService.pickupReturnsAttempted(shipments);
		
		return shipments;
	}
	
	//Boxnbiz API's Service
	
	public void inquiry_submit_inquiry(InquiryDetails  sid) throws Exception {
		Map<String,String> ans=new HashMap<>();
		JSONObject json=new JSONObject();
		json.put("company_id",sid.getCompany_id());
		json.put("shipper_person_id",sid.getShipper_person_id());
		json.put("trade_type",sid.getTrade_type());
		json.put("mode", sid.getMode());
		json.put("incoterms", sid.getIncoterms());
		json.put("pickup", sid.getPickup());
		json.put("pol", sid.getPickup());//India
		json.put("pod", sid.getPod());//US
		json.put("delivery", sid.getDelivery());
		json.put("pickup_service", sid.getPickup_service());
		json.put("origin_handling", sid.getOrigin_handling());
		json.put("origin_cha", sid.getOrigin_cha());
		json.put("delivery_service", sid.getDelivery_service());
		json.put("destination_handling", sid.getDestination_handling());
		json.put("destination_cha", sid.getDestination_cha());
		json.put("gross_weight", sid.getGross_weight());
		json.put("gross_weight_unit", sid.getGross_weight_unit());
		json.put("commodity", sid.getCommodity());
		json.put("cargo_type", sid.getCargo_type());
		json.put("expected_pickup_Date", sid.getExpected_pickup_date());
		json.put("lcl_package_quantity", sid.getLcl_package_quantity());
		json.put("lcl_package_type", sid.getLcl_package_type());
		json.put("fcl_container_quantity", sid.getFcl_container_quantity());
		json.put("fcl_container_type", sid.getFcl_container_type());
		json.put("fcl_container_size", sid.getFcl_container_size());
		json.put("fcl_container_stuffing", sid.getFcl_container_stuffing());
		
		JSONArray dtos = new JSONArray();
		
		JSONObject dto = new JSONObject();
		dto.put("length", sid.getLength());
		dto.put("width", sid.getWidth());
		dto.put("height", sid.getHeight());
		dto.put("quantity", sid.getQuantity());
		dto.put("unit", sid.getUnit());
		dto.put("air_load_type", sid.getAir_load_type());
		dtos.put(dto);
		json.put("dimensionDtos", dtos);
		json.put("special_instruction", sid.getSpecial_instruction());
		StringEntity entity=new StringEntity(json.toString(),  "UTF-8");
		String url="https://demo.api.boxnbiz.com/v1/inquiry/submit-inquiry";
		HttpPost httppost=new HttpPost(url);
		httppost.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httppost.addHeader("Content-Type", "application/json");
		httppost.setEntity(entity);
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httppost);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
		String line="";
        while ((line=in.readLine())!=null){
//        	line=line.substring(1,line.length()-1);
        	System.out.println(line);
        	JSONObject j1=new JSONObject(line);
        	sid.setInquiry_id((String)j1.get("inquiry_id"));
        	sid.setInquiry_type((String)j1.get("inquiry_type"));
//        	String a[]=line.split(",");
//        	for(int i=0;i<a.length;i++) {
//        		String b[]=a[i].split(":");
//        		ans.put(b[0].substring(1,b[0].length()-1),b[1].substring(1,b[1].length()-1));
//        	}
        }
        c2iEcDao.insertInquiryDetails(sid);
        //return ans;
	}
	public InquiryDetails getInquiryDetails(int inquiry_details_id) throws SQLException{
		return c2iEcDao.getInquiryDetails(inquiry_details_id);
	}
	
	public void updateInquiryDetails(InquiryDetails sid) throws Exception{
		c2iEcDao.updateInquiryDetails(sid);
		Map<String,String> ans=new HashMap<>();
		//InquiryDetails sid=c2iEcDao.getInquiryDetails(id);
		JSONObject json=new JSONObject();
		json.put("company_id",sid.getCompany_id());
		json.put("shipper_person_id",sid.getShipper_person_id());
		json.put("trade_type",sid.getTrade_type());
		json.put("mode", sid.getMode());
		json.put("incoterms", sid.getIncoterms());
		json.put("pickup", sid.getPickup());
		json.put("pol", sid.getPickup());//India
		json.put("pod", sid.getPod());//US
		json.put("delivery", sid.getDelivery());
		json.put("pickup_service", sid.getPickup_service());
		json.put("origin_handling", sid.getOrigin_handling());
		json.put("origin_cha", sid.getOrigin_cha());
		json.put("delivery_service", sid.getDelivery_service());
		json.put("destination_handling", sid.getDestination_handling());
		json.put("destination_cha", sid.getDestination_cha());
		json.put("gross_weight", sid.getGross_weight());
		json.put("gross_weight_unit", sid.getGross_weight_unit());
		json.put("commodity", sid.getCommodity());
		json.put("cargo_type", sid.getCargo_type());
		json.put("expected_pickup_Date", sid.getExpected_pickup_date());
		json.put("lcl_package_quantity", sid.getLcl_package_quantity());
		json.put("lcl_package_type", sid.getLcl_package_type());
		json.put("fcl_container_quantity", sid.getFcl_container_quantity());
		json.put("fcl_container_type", sid.getFcl_container_type());
		json.put("fcl_container_size", sid.getFcl_container_size());
		json.put("fcl_container_stuffing", sid.getFcl_container_stuffing());
		
		JSONArray dtos = new JSONArray();
		
		JSONObject dto = new JSONObject();
		dto.put("length", sid.getLength());
		dto.put("width", sid.getWidth());
		dto.put("height", sid.getHeight());
		dto.put("quantity", sid.getQuantity());
		dto.put("unit", sid.getUnit());
		dto.put("air_load_type", sid.getAir_load_type());
		dtos.put(dto);
		json.put("dimensionDtos", dtos);
		json.put("special_instruction", sid.getSpecial_instruction());
		
		
		
		StringEntity entity=new StringEntity(json.toString(),  "UTF-8");
		String url="https://demo.api.boxnbiz.com/v1/inquiry/update-inquiry/"+sid.getInquiry_id();
		HttpPut httpput=new HttpPut(url);
		httpput.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpput.addHeader("Content-Type", "application/json");
		httpput.setEntity(entity);
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpput);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
}