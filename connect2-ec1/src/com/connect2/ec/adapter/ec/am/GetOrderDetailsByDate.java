package com.connect2.ec.adapter.ec.am;

import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.beans.factory.annotation.Autowired;

import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.client.MwsUtl;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrdersRequest;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrdersResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ResponseHeaderMetadata;
import com.connect2.ec.adapter.ec.am.orders.samples.MarketplaceWebServiceOrdersSampleConfig;
import com.connect2.ec.adapter.ec.am.orders.services.MarketplaceWebServiceOrders;
import com.connect2.ec.adapter.ec.am.orders.services.MarketplaceWebServiceOrdersClient;
import com.connect2.ec.adapter.ec.am.orders.services.MarketplaceWebServiceOrdersException;
import com.connect2.ec.adapter.ec.am.service.XmlToAmazonProduct;

public class GetOrderDetailsByDate {

	
	public static HashMap<Object,Object> invokeListOrders(
            MarketplaceWebServiceOrders client, 
            ListOrdersRequest request) {
        try {
            // Call the service.
            ListOrdersResponse response = client.listOrders(request);
            ResponseHeaderMetadata rhmd = response.getResponseHeaderMetadata();
            // We recommend logging every the request id and timestamp of every call.
            System.out.println("Response:");
            System.out.println("RequestId: "+rhmd.getRequestId());
            System.out.println("Timestamp: "+rhmd.getTimestamp());
            String responseXml = response.toXML(); 
            HashMap<Object,Object> resultMap=XmlToAmazonProduct.getOrderDetails(responseXml);
            System.out.println(responseXml);
            return resultMap;
        } catch (MarketplaceWebServiceOrdersException ex) {
            // Exception properties are important for diagnostics.
            System.out.println("Service Exception:");
            ResponseHeaderMetadata rhmd = ex.getResponseHeaderMetadata();
            if(rhmd != null) {
                System.out.println("RequestId: "+rhmd.getRequestId());
                System.out.println("Timestamp: "+rhmd.getTimestamp());
            }
            System.out.println("Message: "+ex.getMessage());
            System.out.println("StatusCode: "+ex.getStatusCode());
            System.out.println("ErrorCode: "+ex.getErrorCode());
            System.out.println("ErrorType: "+ex.getErrorType());
            throw ex;
        }
    }

    /**
     *  Command line entry point.
     */
    public static HashMap<Object,Object> getOrderDetailsByDate(CredentialsBean credentials,Date startDate, Date endDate) {

		
        MarketplaceWebServiceOrdersClient client = MarketplaceWebServiceOrdersSampleConfig.getClient(credentials);


        ListOrdersRequest request = new ListOrdersRequest();
        String sellerId = credentials.getMerchantId();
        request.setSellerId(sellerId);
        String mwsAuthToken = credentials.getSellerDevAuthToken();
        request.setMWSAuthToken(mwsAuthToken);
        
        XMLGregorianCalendar createdAfter = null,createdBefore=null;
        GregorianCalendar sd = new GregorianCalendar();
        sd.setTime(startDate);
        GregorianCalendar ed = new GregorianCalendar();
        ed.setTime(endDate);
        
        try{
        	createdAfter = DatatypeFactory.newInstance().newXMLGregorianCalendar(sd);
        	createdBefore = DatatypeFactory.newInstance().newXMLGregorianCalendar(ed);
	    }catch(Exception e){
	        e.printStackTrace();
	    }
        
        request.setCreatedAfter(createdAfter);
        request.setCreatedBefore(createdBefore);
        
//        XMLGregorianCalendar lastUpdatedAfter = MwsUtl.getDTF().newXMLGregorianCalendar();
//        request.setLastUpdatedAfter(lastUpdatedAfter);
//        XMLGregorianCalendar lastUpdatedBefore = MwsUtl.getDTF().newXMLGregorianCalendar();
//        request.setLastUpdatedBefore(lastUpdatedBefore);
//        List<String> orderStatus = new ArrayList<String>();
//        request.setOrderStatus(orderStatus);
//        List<String> marketplaceId = new ArrayList<String>();
//        request.setMarketplaceId(marketplaceId);
//        List<String> fulfillmentChannel = new ArrayList<String>();
//        request.setFulfillmentChannel(fulfillmentChannel);
//        List<String> paymentMethod = new ArrayList<String>();
//        request.setPaymentMethod(paymentMethod);
//        String buyerEmail = "example";
//        request.setBuyerEmail(buyerEmail);
//        String sellerOrderId = "example";
//        request.setSellerOrderId(sellerOrderId);
//        Integer maxResultsPerPage = 1;
//        request.setMaxResultsPerPage(maxResultsPerPage);
//        List<String> tfmShipmentStatus = new ArrayList<String>();
//        request.setTFMShipmentStatus(tfmShipmentStatus);
//        List<String> easyShipShipmentStatus = new ArrayList<String>();
//        request.setEasyShipShipmentStatus(easyShipShipmentStatus);

        HashMap<Object,Object> result=invokeListOrders(client, request);
        return result;

    }
}
