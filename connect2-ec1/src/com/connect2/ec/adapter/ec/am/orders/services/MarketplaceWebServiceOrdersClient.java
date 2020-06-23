/*******************************************************************************
 * Copyright 2009-2020 Amazon Services. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 *
 * You may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://aws.amazon.com/apache2.0
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 *******************************************************************************
 * Marketplace Web Service Orders
 * API Version: 2013-09-01
 * Library Version: 2020-02-03
 * Generated: Fri Feb 28 01:33:29 UTC 2020
 */
package com.connect2.ec.adapter.ec.am.orders.services;


import com.connect2.ec.adapter.ec.am.client.MwsConnection;
import com.connect2.ec.adapter.ec.am.client.MwsException;
import com.connect2.ec.adapter.ec.am.client.MwsObject;
import com.connect2.ec.adapter.ec.am.client.MwsRequestType;
import com.connect2.ec.adapter.ec.am.client.MwsResponseHeaderMetadata;
import com.connect2.ec.adapter.ec.am.client.MwsUtl;
import com.connect2.ec.adapter.ec.am.orders.model.GetOrderRequest;
import com.connect2.ec.adapter.ec.am.orders.model.GetOrderResponse;
import com.connect2.ec.adapter.ec.am.orders.model.GetServiceStatusRequest;
import com.connect2.ec.adapter.ec.am.orders.model.GetServiceStatusResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrderItemsByNextTokenRequest;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrderItemsByNextTokenResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrderItemsRequest;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrderItemsResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrdersByNextTokenRequest;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrdersByNextTokenResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrdersRequest;
import com.connect2.ec.adapter.ec.am.orders.model.ListOrdersResponse;
import com.connect2.ec.adapter.ec.am.orders.model.MWSResponse;
import com.connect2.ec.adapter.ec.am.orders.model.ResponseHeaderMetadata;

public class MarketplaceWebServiceOrdersClient implements MarketplaceWebServiceOrders {

    private static final String libraryName = "MarketplaceWebServiceOrders";

    private static final String libraryVersion = "2020-02-03";

    protected String servicePath;

    protected final MwsConnection connection;

    public MarketplaceWebServiceOrdersClient(
            String accessKey,
            String secretKey,
            String applicationName,
            String applicationVersion,
            MarketplaceWebServiceOrdersConfig config) {
        connection = config.copyConnection();
        connection.setAwsAccessKeyId(accessKey);
        connection.setAwsSecretKeyId(secretKey);
        connection.setApplicationName(applicationName);
        connection.setApplicationVersion(applicationVersion);
        connection.setLibraryVersion(libraryVersion);
        servicePath = config.getServicePath();
    }

    public MarketplaceWebServiceOrdersClient(
            String accessKey,
            String secretKey,
            MarketplaceWebServiceOrdersConfig config) {
        this(accessKey, secretKey, libraryName, libraryVersion, config);
    }

    public MarketplaceWebServiceOrdersClient(
            String accessKey,
            String secretKey,
            String applicationName,
            String applicationVersion) {
        this(accessKey, secretKey, applicationName, 
                applicationVersion, new MarketplaceWebServiceOrdersConfig());
    }

    public GetOrderResponse getOrder(GetOrderRequest request) {
        return connection.call(
            new RequestType("GetOrder", GetOrderResponse.class, servicePath),
            request);
    }

    public GetServiceStatusResponse getServiceStatus(GetServiceStatusRequest request) {
        return connection.call(
            new RequestType("GetServiceStatus", GetServiceStatusResponse.class, servicePath),
            request);
    }

    public ListOrderItemsResponse listOrderItems(ListOrderItemsRequest request) {
        return connection.call(
            new RequestType("ListOrderItems", ListOrderItemsResponse.class, servicePath),
            request);
    }

    public ListOrderItemsByNextTokenResponse listOrderItemsByNextToken(ListOrderItemsByNextTokenRequest request) {
        return connection.call(
            new RequestType("ListOrderItemsByNextToken", ListOrderItemsByNextTokenResponse.class, servicePath),
            request);
    }

    public ListOrdersResponse listOrders(ListOrdersRequest request) {
        return connection.call(
            new RequestType("ListOrders", ListOrdersResponse.class, servicePath),
            request);
    }

    public ListOrdersByNextTokenResponse listOrdersByNextToken(ListOrdersByNextTokenRequest request) {
        return connection.call(
            new RequestType("ListOrdersByNextToken", ListOrdersByNextTokenResponse.class, servicePath),
            request);
    }

    public static String quoteAppName(String s) {
        return MwsUtl.escapeAppName(s);
    }

    public static String quoteAppVersion(String s) {
        return MwsUtl.escapeAppVersion(s);
    }

    public static String quoteAttributeName(String s) {
        return MwsUtl.escapeAttributeName(s);
    }

    public static String quoteAttributeValue(String s) {
        return MwsUtl.escapeAttributeValue(s);
    }

    protected static class RequestType implements MwsRequestType {

        private final String operationName;
        private final Class<? extends MWSResponse> responseClass;
        private final String servicePath;

        public RequestType(String operationName, Class<? extends MWSResponse> responseClass, String servicePath) {
            this.operationName = operationName;
            this.responseClass = responseClass;
            this.servicePath = servicePath;
        }

        @Override
        public String getServicePath() {
            return this.servicePath;
        }

        @Override
        public String getOperationName() {
            return this.operationName;
        }

        @Override
        public Class<? extends MwsObject> getResponseClass() {
            return this.responseClass;
        }

        @Override
        public MwsException wrapException(Throwable cause) {
            return new MarketplaceWebServiceOrdersException(cause);
        }

        @Override
        public void setRHMD(MwsObject response, MwsResponseHeaderMetadata rhmd) {
            ((MWSResponse)response).setResponseHeaderMetadata(new ResponseHeaderMetadata(rhmd));
        }
    }

}
