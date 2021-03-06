package com.connect2.ec.adapter.ec.am;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.beans.factory.annotation.Autowired;

import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;
import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.FBAInventoryServiceMWS;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.FBAInventoryServiceMWSClient;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.FBAInventoryServiceMWSException;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.model.ListInventorySupplyRequest;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.model.ListInventorySupplyResponse;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.model.ResponseHeaderMetadata;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.model.SellerSkuList;
import com.connect2.ec.adapter.ec.am.fulfillmentinventory.samples.FBAInventoryServiceMWSSampleConfig;
import com.connect2.ec.adapter.ec.am.model.IdList;
import com.connect2.ec.adapter.ec.am.service.XmlToAmazonProduct;

public class GetInventory {
	
	@Autowired
	private static XmlToAmazonProduct xmlToAmazonProduct=new XmlToAmazonProduct();;
	
	public static List<AmazonProduct> invokeListInventorySupply(
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
            
            List<AmazonProduct>amazonProductList = xmlToAmazonProduct.getInventory(responseXml);
            System.out.println(amazonProductList.size());
            for(int i=0;i<amazonProductList.size();i++) {
            	AmazonProduct temp=amazonProductList.get(i);
            	System.out.println(temp.getStock());
            	System.out.println(temp.getSku());
            }
            System.out.println(responseXml);
            return amazonProductList;
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
	
	
	public static List<AmazonProduct> getInventory(CredentialsBean credentials,List<String> member) throws DatatypeConfigurationException {
    	
    	FBAInventoryServiceMWSClient client = FBAInventoryServiceMWSSampleConfig.getClient(credentials);
    	
        ListInventorySupplyRequest request = new ListInventorySupplyRequest();
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
        
        SellerSkuList sellerSkus = new SellerSkuList();
        sellerSkus.setMember(member);
        request.setSellerSkus(sellerSkus);
        
        String FORMATER = "yyyy-MM-dd'T'HH:mm:ss";
		
        DateFormat format = new SimpleDateFormat(FORMATER);
        		
        Date date = new Date();
        XMLGregorianCalendar gDateFormatted1 =DatatypeFactory.newInstance().newXMLGregorianCalendar(format.format(date));
        System.out.println(gDateFormatted1);
        
        List<AmazonProduct> amazonProductList=invokeListInventorySupply(client, request);
        return amazonProductList;

    }
}
