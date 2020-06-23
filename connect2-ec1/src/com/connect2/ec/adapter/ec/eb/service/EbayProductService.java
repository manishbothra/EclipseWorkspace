package com.connect2.ec.adapter.ec.eb.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.connect2.ec.adapter.ec.eb.accessToken.api.client.auth.oauth2.model.OAuthResponse;
import com.connect2.ec.adapter.ec.eb.bean.EbayProduct;
import com.connect2.ec.adapter.ec.fk.FlipkartProductService;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.utility.HttpConnector;
import com.connect2.utility.HttpConnector.Response;
import com.google.gson.Gson;

@Service
public class EbayProductService extends EbayEcomBaseService {

	private final String serviceUrl="https://api.ebay.com/sell";
	
	private final Logger logger = LoggerFactory.getLogger(FlipkartProductService.class);
	
	
	public String insertProduct(C2IEcProduct c2iEcProduct) {
		String status="false";
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.item.draft");
		OAuthResponse access_token=null;
		try {
			logger.info("ADDING EBAY PRODUCT");
			
			access_token = getApplicationToken(scopes);
			String reqUrl = serviceUrl + "/listing/v1_beta/item_draft/";
			
			Map<String, String> headers = new HashMap<String, String>();
			
			headers.put("X-EBAY-C-MARKETPLACE-ID",c2iEcProduct.getMarketplace());
			if(c2iEcProduct.getMarketplace().equalsIgnoreCase("EBAY_CA")) {
				headers.put("Content-Language", "fr-CA");
			}

			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			EbayProduct ebayProduct=new EbayProduct(c2iEcProduct);
			Map<String,Object> product = ebayProduct.payloadForAddProduct(ebayProduct);
			
			Gson gson = new Gson(); 
			String payload = gson.toJson(product); 
			
			
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			
			if (response.getStatusCode() == 201) {
				status = "true";
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN ADDING PRODUCT INTO EBAY STORE:",e);
		}
		
		return status;
	}
	
	
	public String deleteProduct(String access_token,String sku) {
		//ACCESS TOKEN MUST HAVE THESE SCOPES
		//https://api.ebay.com/oauth/api_scope/sell.inventory
		String status="false";
		
		String reqUrl = serviceUrl + "/inventory_item/"+sku;
		
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Authorization", "Basic " + access_token);
		
		Response response = HttpConnector.connectServer(reqUrl, "DELETE", null, null, headers);
		
		if (response.getStatusCode() == 204) {
			status = "true";
		}
		
		return status;
	}
	

	
	public String updateInventory(C2IEcProduct c2iEcProduct) {
		String status="false";
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.inventory");
		
		OAuthResponse access_token=null;	
		
		try {
			logger.info("UPDATING EBAY PRODUCT WITH SKU" + c2iEcProduct.getSku());
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			String reqUrl = serviceUrl + "/inventory/v1/inventory_item";
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			EbayProduct ebayProduct=new EbayProduct(c2iEcProduct);
			Map<String,Object> product = ebayProduct.payloadForUpdateInventory(ebayProduct);
			
			Gson gson = new Gson(); 
			String payload = gson.toJson(product); 
			
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			
			if (response.getStatusCode() == 200) {
				status = "true";
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN UPDATING EBAY PRODUCT WITH SKU:" + c2iEcProduct.getSku(),e);
		}
		
		return status;
	}
	
	
	public C2IEcProduct getProductUsingSku(String sku) {
		C2IEcProduct c2iEcProduct = new C2IEcProduct();
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.inventory.readonly");
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.inventory");
		
		OAuthResponse access_token=null;
		
		try {
			logger.info("GETTING EBAY PRODUCT WITH SKU" + sku);
			
			String reqUrl = serviceUrl + "/inventory/v1/inventory_item/" + sku;
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token);
				
			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse());
					
				Gson gson = new Gson();
					
				EbayProduct ebayProduct = gson.fromJson(outputJSON.toString(), EbayProduct.class);
					
				c2iEcProduct=ebayProduct.getC2IEcProduct(ebayProduct);

			}
			
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN GETTING PRODUCT WITH SKU" + sku, e);
		}
		
		return c2iEcProduct;
	}
		
	
	//Gets a max of 100 records
	public List<C2IEcProduct> getInventory() {
		List<C2IEcProduct> c2iEcProducts = new ArrayList<C2IEcProduct>();
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.inventory.readonly");
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.inventory");
		
		OAuthResponse access_token=null;
		
		try {
			logger.info("GETTING INVENTORY");

			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			
			String reqUrl = serviceUrl + "/inventory/v1/inventory_item";
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse());
				JSONArray productJSON = outputJSON.getJSONArray("inventoryItems");
				
				for(int i=0;i<productJSON.length();i++) {
					C2IEcProduct c2iEcProduct = new C2IEcProduct();
					
					JSONObject product = productJSON.getJSONObject(i);
					
					Gson gson = new Gson();
					EbayProduct ebayProduct = gson.fromJson(product.toString(), EbayProduct.class);
						
					c2iEcProduct=ebayProduct.getC2IEcProduct(ebayProduct);
					
					c2iEcProducts.add(c2iEcProduct);
				}

			}
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN GETTING INVENTORY", e);

		}
		
		return c2iEcProducts; 
		
	}
	
}
