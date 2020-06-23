package com.connect2.ec.adapter.ec.fk;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.connect2.ec.dao.C2IEcommerceDao;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.utility.HttpConnector;
import com.connect2.utility.HttpConnector.Response;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

@Service
public class FlipkartProductService extends FlipkartEcommBaseService {

	@Autowired
	private C2IEcommerceDao c2iEcDao;
	
	private final Logger logger = LoggerFactory.getLogger(FlipkartProductService.class);

	public List<C2IEcProduct> getProducts(List<String> skus) {
		List<C2IEcProduct> products = new ArrayList<C2IEcProduct>();
		C2IEcProduct c2iEcProduct = new C2IEcProduct();
		try {

			String sku = StringUtils.join(skus, ",");

			logger.info("Getting FLIPKART products for skus: {}", sku);

			String reqUrl = serviceUrl + "/listings/v3/" + sku;

			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			if (!StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse());
				JSONObject productJSON = (JSONObject) outputJSON.get("available");
				
				for(Object fkSKU : productJSON.keySet()) {
					JSONObject skuJSON = productJSON.getJSONObject(fkSKU.toString());

					JsonParser parser = new JsonParser();
					JsonElement mJson = parser.parse(skuJSON.toString());
					
					Gson gson = new Gson();
					
					FKProduct fkProduct = gson.fromJson(mJson, FKProduct.class);
					fkProduct.setSku(fkSKU.toString());
					
					c2iEcProduct=fkProduct.getC2IEcProduct(fkProduct);

					products.add(c2iEcProduct);
				}

			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in getting products with sku" + skus, e);
		}

		return products;
	}

	public String updateProduct(C2IEcProduct c2iEcProduct) {
		String status = "false";
		try {

			String reqUrl = serviceUrl + "/listings/v3/update";

			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());
			
			C2IEcSeller ecSeller = c2iEcDao.getSellerDetails();
			c2iEcProduct.setLocationId(ecSeller.getLocationId());
			c2iEcProduct.setProductId("BAGFPZUQYABKZSFD");
			
			FKProduct fkProduct = new FKProduct(c2iEcProduct);
			String product = new Gson().toJson(fkProduct);
			String payload  = "{\"" + c2iEcProduct.getSku() + "\":" + product +"}";
			System.out.println(payload);
//			String payload  = "{\"" + c2iEcProduct.getSku() + "\":" + " " +"}";
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			
			System.out.println(payload);
			if (response.getStatusCode() == 200) {
				// Product pr = new Gson().fromJson(response.getResponse(),
				// Product.class);
				status = "true";
			}
		} catch (Exception e) {
			status = "false";
			logger.error("Error in updating product with sku" + c2iEcProduct.getSku(), e);
		}

		return status;
	}

	public boolean updateProductPrice(C2IEcProduct product) {
		boolean status = false;
		try {

			String reqUrl = serviceUrl + "/listings/v3/update/price";

			Map<String, Map<String, Object>> prObj = new HashMap<>();

			prObj.put(product.getSku(), new HashMap<String, Object>());
			prObj.get(product.getSku()).put("product_id", product.getProductId());
			Map<String, Object> price = new HashMap<String, Object>();
			prObj.get(product.getSku()).put("price", price);
			price.put("mrp", product.getSellingInfo().getMrp());
			price.put("selling_price", product.getSellingInfo().getSellingPrice());
			price.put("currency", "INR");

			String inputJSON = new Gson().toJson(prObj);

			System.out.println(inputJSON);
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", inputJSON, headers);
			if (response.getStatusCode() == 200) {
				// Product pr = new Gson().fromJson(response.getResponse(),
				// Product.class);
				status = true;
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in updating product price with sku" + product.getSku(), e);
			status = false;
		}

		return status;

	}

	public boolean updateProductInventory(C2IEcProduct product) {
		boolean status = false;
		try {

			String reqUrl = serviceUrl + "/listings/v3/update/inventory";

			Map<String, Map<String, Object>> invObj = new HashMap<>();
			
			invObj.put(product.getSku(), new HashMap<String, Object>());
			invObj.get(product.getSku()).put("product_id", product.getProductId());
			
			List<Map<String, Object>> locations = new ArrayList<Map<String, Object>>();

			Map<String, Object> location = new HashMap<String, Object>();
			
			C2IEcSeller ecSeller = c2iEcDao.getSellerDetails();
			
			location.put("id", ecSeller.getLocationId());
			location.put("inventory", product.getStock());
			
			locations.add(location);
			
			invObj.get(product.getSku()).put("locations", locations);

			String inputJSON = new Gson().toJson(invObj);

			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", inputJSON, headers);
			if (response.getStatusCode() == 200) {
				// Product pr = new Gson().fromJson(response.getResponse(),
				// Product.class);
				status = true;
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in updating product price with sku" + product.getSku(), e);
			status = false;
		}
		return status;
	}
}
