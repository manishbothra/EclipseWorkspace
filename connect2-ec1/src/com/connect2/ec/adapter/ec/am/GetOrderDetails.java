package com.connect2.ec.adapter.ec.am;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.orders.model.GetOrderRequest;
import com.connect2.ec.adapter.ec.am.orders.model.GetOrderResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ResponseHeaderMetadata;
import com.connect2.ec.adapter.ec.am.orders.samples.MarketplaceWebServiceOrdersSampleConfig;
import com.connect2.ec.adapter.ec.am.orders.services.MarketplaceWebServiceOrders;
import com.connect2.ec.adapter.ec.am.orders.services.MarketplaceWebServiceOrdersClient;
import com.connect2.ec.adapter.ec.am.orders.services.MarketplaceWebServiceOrdersException;
import com.connect2.ec.adapter.ec.am.service.XmlToAmazonProduct;

public class GetOrderDetails {

    public static HashMap<Object,Object> invokeGetOrder(
            MarketplaceWebServiceOrders client, 
            GetOrderRequest request) {
        try {
            // Call the service.
            GetOrderResponse response = client.getOrder(request);
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
    public static HashMap<Object,Object> getOrders(CredentialsBean credentials,List<String> orderId) {

        MarketplaceWebServiceOrdersClient client = MarketplaceWebServiceOrdersSampleConfig.getClient(credentials);

        GetOrderRequest request = new GetOrderRequest();
        String sellerId = credentials.getMerchantId();
        request.setSellerId(sellerId);
        String mwsAuthToken = credentials.getSellerDevAuthToken();
        request.setMWSAuthToken(mwsAuthToken);
        request.setAmazonOrderId(orderId);

        // Make the call.
        HashMap<Object,Object> result=invokeGetOrder(client, request);
        
        return result;

    }

}
