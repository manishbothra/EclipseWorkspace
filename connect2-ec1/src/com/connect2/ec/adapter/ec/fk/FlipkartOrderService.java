package com.connect2.ec.adapter.ec.fk;

import java.lang.reflect.Type;
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

import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.ec.domain.C2IEcShipment;
import com.connect2.utility.HttpConnector;
import com.connect2.utility.HttpConnector.Response;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

@Service
public class FlipkartOrderService extends FlipkartEcommBaseService {

	private final Logger logger = LoggerFactory.getLogger(FlipkartOrderService.class);

	public List<C2IEcShipment> searchShipment(List<C2IEcShipment> shipments) {
		try {
			String api = serviceUrl + "/v3/shipments/filter/";

			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(shipments);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonElement mJson = parser.parse(response.getResponse());
				Gson gson = new Gson();

				System.out.println(mJson);
				Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
				}.getType();
				shipments = gson.fromJson(mJson, typeOfT);
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in searching shipment. ", e);
		}
		return shipments;
	}
	
	
	public List<C2IEcShipment> getShipmentsByShipmentID(List<String> shipmentIds) {
		 List<C2IEcShipment> shipments= new ArrayList<C2IEcShipment>();
		 try{
			  String shipmentId = StringUtils.join(shipmentIds, ",");
			  String api = serviceUrl + "/v3/shipments?shipmentIds=" + shipmentId;
			  
			  logger.info("Getting shipments for shipmentIds:", shipmentId);
			  
			  Map<String, String> headers = new HashMap<String, String>();
			  headers.put("Authorization", "Bearer " + getAccessToken());
			  
			  Response response = HttpConnector.connectServer(api, "GET", null, null, headers);
			  
			  if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				  int index=0;
				  for(String id : shipmentIds) {
					  JSONObject outputJSON = new JSONObject(response.getResponse());
						JSONArray shipmentsJSON = (JSONArray) outputJSON.get("shipments");
						JSONObject shipJSON = shipmentsJSON.getJSONObject(index++);

						JsonParser parser = new JsonParser();
						JsonElement mJson = parser.parse(shipJSON.toString());
						Gson gson = new Gson();

						System.out.println(mJson);
						Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
						}.getType();
						shipments = gson.fromJson(mJson, typeOfT);

				}
			  } 	
		 }catch(Exception e) {
				e.printStackTrace();
				logger.error("Error in getting shipments with shipmentIds" + shipmentIds, e);
		}
		 return shipments;
	 }

	
	public List<C2IEcShipment> generateLabel(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v3/shipments/labels";

			List<FKShipment> fshs = new ArrayList<>();
			for (C2IEcShipment csh : shipments) {
				fshs.add(new FKShipment(csh));
			}
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(fshs);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("shipments")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in generating label. ", e);
		}

		return statuses;
	}
	
	public void getShipmentsLabels(List<String> shipmentIds) {
		 try{
			  String shipmentId = StringUtils.join(shipmentIds, ",");
			  String api = serviceUrl + "/v3/shipments/" + shipmentId +"/labels";
			  
			  logger.info("Getting shipments for shipmentIds:", shipmentId);
			  
			  Map<String, String> headers = new HashMap<String, String>();
			  headers.put("Authorization", "Bearer " + getAccessToken());
			  
			  Response response = HttpConnector.connectServer(api, "GET", null, null, headers);
	         
			  if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				 // Download pdf which contains shipping labels and customer invoices 
			  } 	
		 }catch(Exception e) {
				e.printStackTrace();
				logger.error("Error in getting shipments lables" + shipmentIds, e);
		}

	 }
	
	
	public List<FKInvoice> getShipmentsInvoices(List<String> shipmentIds) {
		List<FKInvoice> invoices = new ArrayList<FKInvoice>();
		 try{
			  String shipmentId = StringUtils.join(shipmentIds, ",");
			  String api = serviceUrl + "/v3/shipments/" + shipmentId + "/invoices";
			   
			  logger.info("Getting shipments Invoices for shipmentIds:", shipmentId);
			  
			  Map<String, String> headers = new HashMap<String, String>();
			  headers.put("Authorization", "Bearer " + getAccessToken());
			  
			  Response response = HttpConnector.connectServer(api, "GET", null, null, headers);
	         
			  if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				 // Download pdf which contains shipments invoices 
				  
				  int index=0;
				  for(String id : shipmentIds) {
					  JSONObject outputJSON = new JSONObject(response.getResponse());
						JSONArray shipmentsJSON = (JSONArray) outputJSON.get("invoices");
						JSONObject shipJSON = shipmentsJSON.getJSONObject(index++);

						JsonParser parser = new JsonParser();
						JsonElement mJson = parser.parse(shipJSON.toString());
						Gson gson = new Gson();

						System.out.println(mJson);
						FKInvoice fkinv = gson.fromJson(mJson, FKInvoice.class);

						invoices.add(fkinv);
				}
				  
			  } 	
		 }catch(Exception e) {
				e.printStackTrace();
				logger.error("Error in getting shipments invoices" + shipmentIds, e);
		}
		 return invoices;
	 }
	
	
	public List<C2IEcShipment> markReadyToDispatch(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v3/shipments/dispatch";
		
			Map<String, Object> inputJSON = new HashMap<>();
				
			List<String> shids = new ArrayList<>();
			for (C2IEcShipment csh : shipments) {
				shids.add(csh.getShipmentId());
			}
			
			inputJSON.put("shipmentIds", shids);
			
			C2IEcSeller cs = new C2IEcSeller();
			inputJSON.put("locationId", cs.getLocationId());
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = inputJSON.toString();
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("shipments")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in marking items as ready to dispatch. ", e);
		}
		
		return statuses;
	}
	

	public List<C2IEcShipment>  cancelOrder(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v3/shipments/cancel";
			
			Map<String, Object> inputJSON = new HashMap<>();
			
			List<Map<String,Object>> shipmentsList = new ArrayList<>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> cship = new HashMap<>();
				cship.put("reason", csh.getReason());
				cship.put("cancellationGroupIds", csh.getCancellationOrderIds());
				cship.put("shipmentId", csh.getShipmentId());
				cship.put("locationId", csh.getLocationId());
				
				shipmentsList.add(cship);
			}
			
			inputJSON.put("shipments", shipmentsList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("shipments")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in cancelling order. ", e);
		}
		
		return statuses;

	}

	public List<C2IEcShipment>  markDelivered(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/shipments/delivery";

			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> shipmentsList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> shipment = new HashMap<String, Object>();
				shipment.put("shipmentID",csh.getShipmentId().toString());
				shipment.put("deliveryDate",csh.getDeliveryDate());
				
				shipmentsList.add(shipment);
			}
			
			inputJSON.put("shipments", shipmentsList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("shipments")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in marking item as delivered to buyer. ", e);
		}
		
		return statuses;
	}

	public List<C2IEcShipment>  markAttemptedDelivery(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/shipments/deliveryAttempt";
			
			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> shipmentsList = new ArrayList<Map<String, Object>>();
			
			for(C2IEcShipment csh : shipments) {
				Map<String, Object> shipment = new HashMap<String, Object>();
				shipment.put("shipmentID",csh.getShipmentId().toString());
				shipment.put("deliveryDate",csh.getDeliveryDate());
				
				Map<String, Object> failureAttributes = new HashMap<String, Object>();
				failureAttributes.put("subReason", csh.getFailureSubReason());
				failureAttributes.put("reason", csh.getReason());
				failureAttributes.put("newDeliveryDate", csh.getNewDeliveryDate());
				
				shipment.put("failureAttributes", failureAttributes);
				
				shipmentsList.add(shipment);
			}
			
			inputJSON.put("shipments", shipmentsList);
	
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("shipments")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in marking delivery as attempted. ", e);
		}

		return statuses;
	}


	public  List<C2IEcShipment>  markServiceCompleted(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/services/complete";

			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> serviceList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> service = new HashMap<String, Object>();
				service.put("serviceFulfilmentId",csh.getServiceFulfilmentId());
				service.put("deliveryDate",csh.getServiceDeliveryDate());
				
				serviceList.add(service);
			}
			
			inputJSON.put("services", serviceList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("services")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in marking service as completed. ", e);
		}
		
		return statuses;

	}


	public  List<C2IEcShipment> markServiceAttempted(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/services/attempt";

			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> serviceList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> service = new HashMap<String, Object>();
				service.put("subReason", csh.getSvFailureSubReason());
				service.put("reason", csh.getSvFailureReason());
				service.put("comments", csh.getSvComments());
				service.put("newDeliveryDate", csh.getSvnewDeliveryDate());
				service.put("serviceFulfilmentId",csh.getServiceFulfilmentId());
				service.put("deliveryDate",csh.getServiceDeliveryDate());
				
				serviceList.add(service);
			}
			
			inputJSON.put("services", serviceList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("services")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in marking service as attempted. ", e);
		}
		return statuses;

	}

	public  List<C2IEcShipment> approveReturns(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/returns/approve";

			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> returnsList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> returns = new HashMap<String, Object>();
				returns.put("comments", csh.getReturnsComments());
				returns.put("serviceDate", csh.getReturnsServiceDate());
				returns.put("returnId", csh.getReturnId());
				returns.put("serviceFulfilmentId", csh.getReturnServiceFulfilmentId());
				
				returnsList.add(returns);
			}
			
			inputJSON.put("returns", returnsList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("returns")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in approving return. ", e);
		}

		return statuses;
	}

	public  List<C2IEcShipment> rejectReturns(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/returns/reject";

			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> returnsList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> returns = new HashMap<String, Object>();
				returns.put("comments", csh.getReturnsComments());
				returns.put("serviceDate", csh.getReturnsServiceDate());
				returns.put("returnId",csh.getReturnId());
				returns.put("serviceFulfilmentId", csh.getReturnServiceFulfilmentId());
				
				returnsList.add(returns);
			}
			
			inputJSON.put("returns", returnsList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("returns")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in rejecting return. ", e);
		}
		return statuses;
	}

	public  List<C2IEcShipment> completeReturns(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/returns/complete";

			Map<String, Object> inputJSON = new HashMap<String, Object>();
			
			List<String> returnIds = new ArrayList<String>();
			for(C2IEcShipment csh : shipments) {
				returnIds.add(csh.getReturnId());
			}
			inputJSON.put("returnIds", returnIds);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("shipments")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in completing return. ", e);
		}

		return statuses;
	}

	public  List<C2IEcShipment> pickupReturns(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/returns/pickup";
			
			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> returnsList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> returns = new HashMap<String, Object>();
				returns.put("returnId", csh.getReturnId());
				returns.put("pickupDate", csh.getPickupDate());
				
				returnsList.add(returns);
			}
			
			inputJSON.put("returns", returnsList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("returns")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in searching returns pickup. ", e);
		}
		return statuses;

	}

	public  List<C2IEcShipment> pickupReturnsAttempted(List<C2IEcShipment> shipments) {
		List<C2IEcShipment> statuses = null;
		try {
			String api = serviceUrl + "/v2/returns/pickupAttempt";
			
			Map<String, Object> inputJSON = new HashMap<String, Object>();

			List<Map<String, Object>> returnsList = new ArrayList<Map<String, Object>>();
			
			for (C2IEcShipment csh : shipments) {
				Map<String, Object> returns = new HashMap<String, Object>();
				returns.put("reason", csh.getPickupReturnsFailureReason());
				returns.put("returnId", csh.getReturnId());
				returns.put("pickupDate", csh.getPickupDate());
				returns.put("newPickupDate", csh.getNewPickupDate());
				
				returnsList.add(returns);
			}
			
			inputJSON.put("returns", returnsList);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Authorization", "Bearer " + getAccessToken());

			String payload = new Gson().toJson(inputJSON);
			Response response = HttpConnector.connectServer(api, "POST", "application/json", payload, headers);

			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JsonParser parser = new JsonParser();
				JsonObject mJson = parser.parse(response.getResponse()).getAsJsonObject();
				if (mJson.has("returns")) {
					Type typeOfT = new TypeToken<List<C2IEcShipment>>() {
					}.getType();
					statuses = new Gson().fromJson(mJson, typeOfT);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Error in attempting returns pickup. ", e);
		}
		return statuses;
	}
	
	
	public List<FKReturnItem> getReturnsByReturnIds(List<String> returnIds) {
		List<FKReturnItem> returns = new ArrayList<FKReturnItem>();
		 try{
			  String returnId = StringUtils.join(returnIds, ",");
			  String api = serviceUrl + "/v2/returns?returnIds=" + returnId;
			  
			  logger.info("Getting returns for returnIds:", returnId);
			  
			  Map<String, String> headers = new HashMap<String, String>();
			  headers.put("Authorization", "Bearer " + getAccessToken());
			  
			  Response response = HttpConnector.connectServer(api, "GET", null, null, headers);
			  
			  if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				  int index=0;
				  for(String id : returnIds) {
					  JSONObject outputJSON = new JSONObject(response.getResponse());
						JSONArray shipmentsJSON = (JSONArray) outputJSON.get("returnItems");
						JSONObject shipJSON = shipmentsJSON.getJSONObject(index++);

						JsonParser parser = new JsonParser();
						JsonElement mJson = parser.parse(shipJSON.toString());
						Gson gson = new Gson();

						System.out.println(mJson);
						FKReturnItem rItem = gson.fromJson(mJson, FKReturnItem.class);

						returns.add(rItem);
				}
			  } 	
		 }catch(Exception e) {
				e.printStackTrace();
				logger.error("Error in getting shipments with shipmentIds" + returnIds, e);
		}
		 return returns;
	 }
}

			 
