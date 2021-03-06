package com.connect2.ec.adapter.ec.am;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;
import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.model.IdList;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProducts;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProductsClient;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProductsException;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProductsSampleConfig;
import com.connect2.ec.adapter.ec.am.products.model.GetMyPriceForSKURequest;
import com.connect2.ec.adapter.ec.am.products.model.GetMyPriceForSKUResponse;
import com.connect2.ec.adapter.ec.am.products.model.ResponseHeaderMetadata;
import com.connect2.ec.adapter.ec.am.products.model.SellerSKUListType;
import com.connect2.ec.adapter.ec.am.service.XmlToAmazonProduct;

public class GetMyPriceForSku {
	
	
	@Autowired
	private static XmlToAmazonProduct xmlToAmazonProduct=new XmlToAmazonProduct();
	public static List<AmazonProduct> invokeGetMyPriceForSKU( MarketplaceWebServiceProducts client, GetMyPriceForSKURequest request) {
        try {
        	
            GetMyPriceForSKUResponse response = client.getMyPriceForSKU(request);
            ResponseHeaderMetadata rhmd = response.getResponseHeaderMetadata();
            // We recommend logging every the request id and timestamp of every call.
            System.out.println("Response:");
            System.out.println("RequestId: "+rhmd.getRequestId());
            System.out.println("Timestamp: "+rhmd.getTimestamp());
            String responseXml = response.toXML();
            
            List<AmazonProduct>amazonProductList = xmlToAmazonProduct.getPrice(responseXml);
            System.out.println(amazonProductList.size());
            for(int i=0;i<amazonProductList.size();i++) {
            	AmazonProduct temp=amazonProductList.get(i);
            	System.out.println(temp.getProduct_id());
            	System.out.println(temp.getSku());
            }
            
            System.out.println(responseXml);
            return amazonProductList;
        } catch (MarketplaceWebServiceProductsException ex) {
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
	
	public static List<AmazonProduct> getMyPriceForSku(CredentialsBean credentials,List<String> sku) {
		 MarketplaceWebServiceProductsClient client = MarketplaceWebServiceProductsSampleConfig.getClient(credentials);

	        GetMyPriceForSKURequest request = new GetMyPriceForSKURequest();
	        
	        String sellerId=credentials.getMerchantId();
	        request.setSellerId(sellerId);
	        
	        String mwsAuthToken=credentials.getSellerDevAuthToken();
	        request.setMWSAuthToken(mwsAuthToken);

	        IdList marketplaces=credentials.getMarketplaces();
	        List<String> marketplacesList=marketplaces.getId();
	        String marketplaceId="";
	        for(int i=0;i<marketplacesList.size();i++) {
	        	marketplaceId=marketplacesList.get(i);
	        }
	        request.setMarketplaceId(marketplaceId);
	        
	        SellerSKUListType sellerSKUList = new SellerSKUListType();
	        sellerSKUList.setSellerSKU(sku);
	        request.setSellerSKUList(sellerSKUList);

	        List<AmazonProduct> amazonProductList=invokeGetMyPriceForSKU(client, request);
		return amazonProductList;
	}
	
}
