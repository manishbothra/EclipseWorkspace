package com.connect2.ec.adapter.ec.am;

import java.util.List;

import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;
import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.model.IdList;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProducts;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProductsClient;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProductsException;
import com.connect2.ec.adapter.ec.am.products.MarketplaceWebServiceProductsSampleConfig;
import com.connect2.ec.adapter.ec.am.products.model.GetMatchingProductForIdRequest;
import com.connect2.ec.adapter.ec.am.products.model.GetMatchingProductForIdResponse;
import com.connect2.ec.adapter.ec.am.products.model.IdListType;
import com.connect2.ec.adapter.ec.am.products.model.ResponseHeaderMetadata;
import com.connect2.ec.adapter.ec.am.service.XmlToAmazonProduct;

public class GetProductById {
	
	
	public static List<AmazonProduct> invokeGetMatchingProductForId(MarketplaceWebServiceProducts client, GetMatchingProductForIdRequest request) {
		
		
		try {
            // Call the service.
            GetMatchingProductForIdResponse response = client.getMatchingProductForId(request);
            ResponseHeaderMetadata rhmd = response.getResponseHeaderMetadata();
            // We recommend logging every the request id and timestamp of every call.
//            System.out.println("Response:");
//            System.out.println("RequestId: "+rhmd.getRequestId());
//            System.out.println("Timestamp: "+rhmd.getTimestamp());
            String responseXml = response.toXML();
            
            AmazonProduct amazonProduct=new AmazonProduct();
            
            XmlToAmazonProduct xmlToAmazonProduct=new XmlToAmazonProduct();
            List<AmazonProduct> amazonProducts = xmlToAmazonProduct.saveProduct(responseXml);
            System.out.println("No of products - "+amazonProducts.size());
            System.out.println(responseXml);
            return amazonProducts;
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
	
	public static List<AmazonProduct> getProduct(CredentialsBean credentials,List<String> sku) {
		System.out.println("inside get product");
		System.out.println(credentials.getAccessKeyId());
		
		MarketplaceWebServiceProductsClient client = MarketplaceWebServiceProductsSampleConfig.getClient(credentials);
		
		GetMatchingProductForIdRequest request = new GetMatchingProductForIdRequest();
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
        
	    String idType = "SellerSKU";
	    request.setIdType(idType);
	    
	    IdListType idList = new IdListType();
	    idList.setId(sku);
	    request.setIdList(idList);
	
	    String res="";
	    List<AmazonProduct> amazonProductList=invokeGetMatchingProductForId(client, request);
	    for(int i=0;i< amazonProductList.size();i++) {
	    	AmazonProduct amazonProduct=amazonProductList.get(i);
	    	
	    	System.out.println("This is product "+i);
	    
		    System.out.println(amazonProduct.getBrand());
		    System.out.println(amazonProduct.getBrand_color());
		    System.out.println(amazonProduct.getDescription());
		    System.out.println(amazonProduct.getItem_pack_quantity());
		    System.out.println(amazonProduct.getManufacturer_details());
		    System.out.println(amazonProduct.getNo_of_items());
		    System.out.println(amazonProduct.getPackage_breadth());
		    System.out.println(amazonProduct.getPackage_height());
		    System.out.println(amazonProduct.getPackage_length());
		    System.out.println(amazonProduct.getProduct_name());
		    System.out.println(amazonProduct.getSize());
		    System.out.println(amazonProduct.getSku());
		    System.out.println(amazonProduct.getPackage_weight());
		    System.out.println(amazonProduct.getMain_img());
		    System.out.println();
		    System.out.println();
		    System.out.println();
	    }
	    return amazonProductList;
	}
}
