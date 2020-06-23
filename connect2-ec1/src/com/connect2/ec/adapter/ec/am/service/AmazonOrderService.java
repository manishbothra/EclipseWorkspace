package com.connect2.ec.adapter.ec.am.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.connect2.ec.adapter.ec.am.GetOrderDetails;
import com.connect2.ec.adapter.ec.am.GetOrderDetailsByDate;
import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;

public class AmazonOrderService extends AmazonEcomBaseService{
	
	@Autowired 
	private XmlEditor xmlEditor;

	public static void main(String args[]) {
		HashMap<Object,Object> orderDetails=new HashMap<Object,Object>();
		orderDetails.put("CancelReason","Kuch Bhii");
		orderDetails.put("MerchantOrderId","merchantOrderID");
		orderDetails.put("MerchantOrderItemId","merchantItemOrderID");
		orderDetails.put("AmazonOrderId","amazonOrderID");
		orderDetails.put("AmazonOrderItemId","amazonItemOrderID");
		orderDetails.put("Quantity","10");
		//postOrderAcknowledgement(orderDetails,"");
	}
	
	public static HashMap<Object,Object> getOrderDetails(List<String>orderId) {		
		String sellerDevAuthToken="amzn.mws.84b81f01-9bc9-b3a3-2883-b22dfc15b070";
		String merchantId="A1ZRT2O38J6EA0";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		result = GetOrderDetails.getOrders(credentials, orderId);
		return result;
	}
	
	public static HashMap<Object,Object> getOrderDetailsByDate(Date startDate,Date endDate) {		
		String sellerDevAuthToken="amzn.mws.84b81f01-9bc9-b3a3-2883-b22dfc15b070";
		String merchantId="A1ZRT2O38J6EA0";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		result = GetOrderDetailsByDate.getOrderDetailsByDate(credentials,startDate, endDate);
		return result;
	}
	public void postOrderAcknowledgement(HashMap<Object,Object> orderDetails,String merchantID) {
		String sellerDevAuthToken="amzn.mws.84b81f01-9bc9-b3a3-2883-b22dfc15b070";
		String merchantId="A1ZRT2O38J6EA0";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		
		String url= xmlEditor.editPostOrderXML(orderDetails,merchantId);
		String feedType="_POST_ORDER_ACKNOWLEDGEMENT_DATA_";
		
//		try {
//			HashMap<Object, Object> result = SubmitFeed.submitProduct(credentials);
//		} catch (NoSuchAlgorithmException | IOException e) {
//			e.printStackTrace();
//		}
	}
	
}
