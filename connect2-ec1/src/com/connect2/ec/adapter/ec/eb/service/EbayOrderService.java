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
import com.connect2.ec.adapter.ec.fk.FlipkartProductService;
import com.connect2.ec.domain.C2IEcOrder;
import com.connect2.utility.HttpConnector;
import com.connect2.utility.HttpConnector.Response;
import com.google.gson.Gson;

@Service
public class EbayOrderService {
	
	private final String serviceUrl="https://api.ebay.com/sell";
	
	private final Logger logger = LoggerFactory.getLogger(FlipkartProductService.class);
	
	public Map<String,Object> getOrder(C2IEcOrder c2iEcOrder) {
		//https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/getOrder
		
		Map<String,Object> orderDetails = new HashMap<String,Object>();
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment");
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly");
		
		OAuthResponse access_token=null;
		String orderId="";

		try {
			orderId=c2iEcOrder.getOrderId();
			
			logger.info("GETTING ORDER DETAILS FOR ORDER WITH ID"+ orderId);
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			String reqUrl=serviceUrl+ "/fulfillment/v1/order/" + orderId ;
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				
				JSONObject outputJSON = new JSONObject(response.getResponse()); 
				  

				Gson gson = new Gson();
//				EbayOrder ebayOrder = gson.fromJson(order.toString(), EbayOrder.class);
				orderDetails = gson.fromJson(outputJSON.toString(), HashMap.class);
			}	

			
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN GETTING ORDER INFO WITH ORDERID" + orderId,e);
		}
		
		return orderDetails;
	}
	
	
	public List<Map<String,Object>> getOrders(List<String>orderIds) {
		//https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/getOrders
		
		List<Map<String,Object>> orders=new ArrayList<Map<String,Object>>();
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment");
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly");
		OAuthResponse access_token=null;
		try {
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			
			Map<String, String> headers = new HashMap<String, String>();
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
		
			logger.info("GETTING ORDER DETAILS FOR ORDERS WITH ID"+ orderIds);
				
			String orderId = StringUtils.join(orderIds, ",");
			String reqUrl=serviceUrl+"/fulfillment/v1/order?orderids=" + orderId;
			
			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse()); 
				JSONArray orderJSON = outputJSON.getJSONArray("orders");
				
				for(int i=0;i<orderJSON.length();i++) {
					  JSONObject order = orderJSON.getJSONObject(i);

					  Gson gson = new Gson();
//					  EbayOrder ebayOrder = gson.fromJson(order.toString(), EbayOrder.class);
					  Map<String,Object> orderDetails = gson.fromJson(order.toString(), HashMap.class);
					  
					  orders.add(orderDetails);
				}	
				  
			  } 
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN GETTING ORDERS INFO");
		}
		
		return orders;
	}
	
	
	public String issueRefund(Map<String,Object> refundDetails,String orderId) {
		//https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/issueRefund
		
		String refundStatus="";
		
		logger.info("ISSUING REFUND FOR ORDERID :" + orderId);

		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.finances");
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl=serviceUrl+"/fulfillment/v1/order/"+ orderId +"/issue_refund";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			String payload=new Gson().toJson(refundDetails);
			
			Response response = HttpConnector.connectServer(reqUrl, "POST","application/json", payload, headers);
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse()); 
				String refundId = outputJSON.getString("refundId");
				refundStatus = outputJSON.getString("refundStatus");
			}
			
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN ISSUING REFUND FOR ORDERID" + orderId,e);
		}
		
		return refundStatus;
	}
	
	
	public String createShippingFulfillment(Map<String,Object> shippingFulfillmentDetails, String orderId) {
		//https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/shipping_fulfillment/methods/createShippingFulfillm
		
		String status="false";	
		logger.info("CREATING SHIPPING FULFILLMENT FOR ORDERID :" + orderId);
				
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment");
		
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl=serviceUrl+"/fulfillment/v1/order/"+orderId+"/shipping_fulfillment";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			String payload=new Gson().toJson(shippingFulfillmentDetails);
			
			Response response = HttpConnector.connectServer(reqUrl, "POST","application/json", payload, headers);
			
			if (response.getStatusCode() == 201) {
				status="true";
			}
			
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN ISSUING REFUND FOR ORDERID" + orderId,e);
		}
		
		return status;
	}
	
	public Map<String,Object> getShippingFulfillment(String orderId) {
		//https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/shipping_fulfillment/methods/getShippingFulfillments
		
		Map<String,Object> shippingFulfillment = new HashMap<String,Object>();
		logger.info("GETTING SHIPPING FULFILLMENT FOR ORDERID" + orderId);
		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment");
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly");
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl=serviceUrl+"/fulfillment/v1/order/"+orderId+"/shipping_fulfillment";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse()); 
				 
				shippingFulfillment = new Gson().fromJson(outputJSON.toString(), HashMap.class);
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN GETTING SHIPPING FULFILLMENT FOR ORDERID" + orderId,e);
		}
		
		return shippingFulfillment;
	}
	
	
	public void getShippingFulfillmentUsingFulfillmentId(String orderId,String fulfillmentId) {
		//https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/shipping_fulfillment/methods/getShippingFulfillment
		
		Map<String,Object> shippingFulfillment = new HashMap<String,Object>();
		logger.info("GETTING SHIPPING FULFILLMENT FOR ORDER ID:" + orderId +" and FULFILLMENTID : " + fulfillmentId);

		
		List<String>scopes=new ArrayList<String>();
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment");
		scopes.add("https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly");
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl=serviceUrl+"/fulfillment/v1/order/"+orderId+"/shipping_fulfillment/"+fulfillmentId;
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			Response response = HttpConnector.connectServer(reqUrl, "GET", null, null, headers);
			
			if (response.getStatusCode() == 200 && !StringUtils.isEmpty(response.getResponse())) {
				JSONObject outputJSON = new JSONObject(response.getResponse()); 
				 
				shippingFulfillment = new Gson().fromJson(outputJSON.toString(), HashMap.class);
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN GETTING SHIPPING FULFILLMENT FOR ORDERID : " + orderId +"and SHIPPING FULFILLMENTID : "+ fulfillmentId,e);
		}
	}
	
	
	public String approveCancellationRequest(String cancelId) {
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_cancellation-cancelid_approve__post.html#Samples
		
		String status = "failure";
		logger.info("APPROVING CANCELLATION REQUEST FOR CANCELID" + cancelId);
		
		List<String>scopes=new ArrayList<String>();
		//There was no scope so maybe this api doesn't need scope

		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/cancellation/"+cancelId+"/approve";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			Response response = HttpConnector.connectServer(reqUrl, "POST", null, null, headers);
			
			if(response.getStatusCode()==200) {
				status = "success";
			}
			
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN APPROVING CANCELLATION REQUEST WITH CANCELID : "+ cancelId,e);
		}
		
		return status;
	}
	
	public String rejectCancellationRequest(String cancelId, Map<String,Object> map) {
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_cancellation-cancelid_reject__post.html
		
		logger.info("REJECTING CANCELLATION REQUEST FOR CANCELID" + cancelId);

		String status="failure";
		List<String>scopes=new ArrayList<String>();
		//There was no scope so maybe this api doesn't need scope

		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/cancellation/"+cancelId+"/reject";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			/* REQUEST PAYLOAD
			 * { 
				"shipmentDate":
				    { 
				    "value": datetime
				    },
				"trackingNumber": string
				}
			*/
			
			String payload= new Gson().toJson(map);
			
			Response response = HttpConnector.connectServer(reqUrl, "POST","application/json", payload, headers);
			if(response.getStatusCode()==200) {
				status = "success";
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN REJECTING CANCELLATION REQUEST WITH CANCELID : "+ cancelId,e);
		}
		return status;
	}
	
	
	public String checkCancellationEligibility(String legacyOrderId) {
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_cancellation_check_eligibility__post.html
		
		String status="failure";
		
		logger.info("CHECKING CANCELLATION ELIGIBILITY FOR LEGACYORDERID" + legacyOrderId);

		List<String>scopes=new ArrayList<String>();
		//There was no scope so maybe this api doesn't need scope
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();

		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/cancellation/check_eligibility";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			String payload = "{ legacyOrderId :" + legacyOrderId + "}";
			
			Response response = HttpConnector.connectServer(reqUrl, "POST","application/json", payload, headers);
			if(response.getStatusCode()==200) {
				status = "success";
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			logger.error("ERROR IN CHECKING CANCELLATION ELIGIBILITY FOR LEGACYORDERID" + legacyOrderId,e);
			
		}
		return status;
	}
	
	public String createCancellation(String legacyOrderId,HashMap<String,String>map) {
		
		//First check eligibility
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_cancellation__post.html
		
		List<String>scopes=new ArrayList<String>();
		//Remaining Scope
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();
		String status="null";
		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/cancellation";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			/* REQUEST PAYLOAD
			 * {
				"buyerPaid": boolean,
				"buyerPaidDate":
				    { 
				    "value": datetime
				    },
				"cancelReason": token,
				"legacyOrderId": string,
				"relistLineItem": [
				    { 
				    "itemId": integer,
				    "quantity": integer,
				    "transactionId": integer
				    }
				  ]
				}
			 * */
			String payload = new Gson().toJson(map);
			//Response status code 200 for successful cancellation approval
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			if(response.getStatusCode()==200 ) {
				status="success";
			}
		}
		catch(Exception e) {
			status="Failed";
			logger.error("ERROR IN CANCELLATION OF LEGACYORDERID" + legacyOrderId,e);
			e.printStackTrace();
		}
		return status;
	}
	
	public String confirmRefundReceived(String cancelId,String refundDate,boolean unpaid) {
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_cancellation-cancelid_confirm__post.html
		
		List<String>scopes=new ArrayList<String>();
		//Remaining Scope
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();
		String status="";
		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/cancellation/"+cancelId+"/confirm";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			String payload="{ \"refundDate\":{ \"value\":" +refundDate+ "},\"unpaidOrder\": "+unpaid+"}";
			
			//Response status code 200 for successful cancellation approval
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			if(response.getStatusCode()==200) {
				status="success";
			}
		}
		catch(Exception e) {
			status="failure";
			logger.error("ERROR IN CONFIRMING REFUND RECEIVED FOR CANCELID" + cancelId,e);
			e.printStackTrace();
		}
		return status;
	}
	
	public String checkReturnEligibiliy(HashMap<String,String>returnEli) {
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_return_check_eligibility__post.html
		
		List<String>scopes=new ArrayList<String>();
		//Remaining Scope
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();
		String status="";
		String itemId = returnEli.get("itemId");
		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/return/check_eligibility";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			/*
			 * { 
				"checkTypes": [
				    token
				   
				  ],
				"itemId": string,
				"reason": token,
				"returnQuantity": integer,
				"transactionId": string
				}
			 */
			String payload= new Gson().toJson(returnEli);
			//Response status code 200 for successful cancellation approval
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			if(response.getStatusCode()==200) {
				status="success";
			}
		}
		catch(Exception e) {
			status="failure";
			logger.error("ERROR IN CONFIRMING RETURN ELIGIBILITY FOR ITEMID" + itemId,e);
			e.printStackTrace();
		}
		return status;
	}
	
	public String cancelReturnRequest(String returnId,HashMap cancelReason) {
		//https://developer.ebay.com/Devzone/post-order/post-order_v2_return-returnid_cancel__post.html
		
		List<String>scopes=new ArrayList<String>();
		//Remaining Scope
		OAuthResponse access_token=null;
		Map<String, String> headers = new HashMap<String, String>();
		String status="";
		try {
			String reqUrl= "https://api.ebay.com/post-order/v2/return/"+returnId+"/cancel";
			
			access_token = EbayEcomBaseService.getApplicationToken(scopes);
			headers.put("Content-Type","application/x-www-form-urlencoded");
			headers.put("Authorization", "Basic " + access_token.getAccessToken());
			
			/*
			 * { 
				"buyerCloseReason": token,
				"comments":
				    { 
				    "content": string,
				    "language": string,
				    "translatedFromContent": string,
				    "translatedFromLanguage": string
				    }
				}
			 */
			String payload= new Gson().toJson(cancelReason);
			//Response status code 200 for successful cancellation approval
			Response response = HttpConnector.connectServer(reqUrl, "POST", "application/json", payload, headers);
			if(response.getStatusCode()==200) {
				status="success";
			}
		}
		catch(Exception e) {
			status="failure";
			logger.error("ERROR IN CANCELLING RETURN REQUEST FOR RETURNID" + returnId,e);
			e.printStackTrace();
		}
		return status;
	}
	
	
	
	
	
}
