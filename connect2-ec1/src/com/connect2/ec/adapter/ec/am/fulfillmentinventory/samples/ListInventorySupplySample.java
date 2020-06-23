/*******************************************************************************
 * Copyright 2009-2016 Amazon Services. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 *
 * You may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://aws.amazon.com/apache2.0
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 *******************************************************************************
 * FBA Inventory Service MWS
 * API Version: 2010-10-01
 * Library Version: 2014-09-30
 * Generated: Mon Mar 21 09:01:27 PDT 2016
 */
package com.connect2.ec.adapter.ec.am.fulfillmentinventory.samples;

import java.util.*;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.client.*;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.*;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.model.*;
import com.connect2.ec.adapter.ec.am.service.XmlToAmazonProduct;


/** Sample call for ListInventorySupply. */
public class ListInventorySupplySample {
	
	@Autowired
	private static XmlToAmazonProduct xmlToAmazonProduct;
    /**
     * Call the service, log response and exceptions.
     *
     * @param client
     * @param request
     *
     * @return The response.
     */
    public static ListInventorySupplyResponse invokeListInventorySupply(
            FBAInventoryServiceMWS client, 
            ListInventorySupplyRequest request) {
        try {
            // Call the service.
            ListInventorySupplyResponse response = client.listInventorySupply(request);
            ResponseHeaderMetadata rhmd = response.getResponseHeaderMetadata();
            // We recommend logging every the request id and timestamp of every call.
            System.out.println("Response:");
            System.out.println("RequestId: "+rhmd.getRequestId());
            System.out.println("Timestamp: "+rhmd.getTimestamp());
            String responseXml = response.toXML();
            System.out.println(responseXml);
            
            xmlToAmazonProduct.getInventory(responseXml);
            
            return response;
        } catch (FBAInventoryServiceMWSException ex) {
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
    public static void getInventory(CredentialsBean credentials) {
    	
    	
    	FBAInventoryServiceMWSClient client = FBAInventoryServiceMWSSampleConfig.getClient(credentials);
    	
        // Create a request.
        ListInventorySupplyRequest request = new ListInventorySupplyRequest();
        String sellerId = "A1ZRT2O38J6EA0";
        request.setSellerId(sellerId);
        String mwsAuthToken = "amzn.mws.84b81f01-9bc9-b3a3-2883-b22dfc15b070";
        request.setMWSAuthToken(mwsAuthToken);
        String marketplace = "India";
        request.setMarketplace(marketplace);
        String marketplaceId = "A21TJRUUN4KGV";
        request.setMarketplaceId(marketplaceId);
        SellerSkuList sellerSkus = new SellerSkuList();
        request.setSellerSkus(sellerSkus);
//        XMLGregorianCalendar queryStartDateTime = MwsUtl.getDTF().newXMLGregorianCalendar();
//        System.out.println(queryStartDateTime);
//        request.setQueryStartDateTime(queryStartDateTime);
        String responseGroup = "example";
        request.setResponseGroup(responseGroup);

        // Make the call.
        ListInventorySupplySample.invokeListInventorySupply(client, request);

    }

}
