package com.connect2.ec.adapter.ec.am;


import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.model.GetFeedSubmissionCountRequest;
import com.connect2.ec.adapter.ec.am.model.GetFeedSubmissionCountResponse;
import com.connect2.ec.adapter.ec.am.model.GetFeedSubmissionCountResult;
import com.connect2.ec.adapter.ec.am.model.ResponseMetadata;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebService;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceClient;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceConfig;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceException;

public class GetFeedSubmissionCount {

	public static String invokeGetFeedSubmissionCount(MarketplaceWebService service, GetFeedSubmissionCountRequest request) {
		String res="";
        try {

            GetFeedSubmissionCountResponse response = service.getFeedSubmissionCount(request);
            res=response.toString();
            
            System.out.println("Change");
            System.out.println("Hello");
            System.out.println("Change");
            System.out.println("Hello");
            
            System.out.println ("GetFeedSubmissionCount Action Response");
            System.out.println ("=============================================================================");
            System.out.println ();

            System.out.print("    GetFeedSubmissionCountResponse");
            System.out.println();
            if (response.isSetGetFeedSubmissionCountResult()) {
                System.out.print("        GetFeedSubmissionCountResult");
                System.out.println();
                GetFeedSubmissionCountResult  getFeedSubmissionCountResult = response.getGetFeedSubmissionCountResult();
                if (getFeedSubmissionCountResult.isSetCount()) {
                    System.out.print("            Count");
                    System.out.println();
                    System.out.print("                " + getFeedSubmissionCountResult.getCount());
                    System.out.println();
                }
            } 
            if (response.isSetResponseMetadata()) {
                System.out.print("        ResponseMetadata");
                System.out.println();
                ResponseMetadata  responseMetadata = response.getResponseMetadata();
                if (responseMetadata.isSetRequestId()) {
                    System.out.print("            RequestId");
                    System.out.println();
                    System.out.print("                " + responseMetadata.getRequestId());
                    System.out.println();
                }
            } 
            System.out.println();
            System.out.println(response.getResponseHeaderMetadata());
            System.out.println();


        } catch (MarketplaceWebServiceException ex) {

            System.out.println("Caught Exception: " + ex.getMessage());
            System.out.println("Response Status Code: " + ex.getStatusCode());
            System.out.println("Error Code: " + ex.getErrorCode());
            System.out.println("Error Type: " + ex.getErrorType());
            System.out.println("Request ID: " + ex.getRequestId());
            System.out.print("XML: " + ex.getXML());
            System.out.println("ResponseHeaderMetadata: " + ex.getResponseHeaderMetadata());
        }
		return res;
    }
	
	
	
	public static String getFeedSubmissionCount(CredentialsBean credentials) {
		final String accessKeyId = "AKIAIJMOKEPY4KCR727Q";
        final String secretAccessKey = "711kwTxXg/+SnyQtI8T1u006nkP7Rt+hazZnm/O7";

//        final String appName = "Seller app";
//        final String appVersion = "<Your Application Version or Build Number or Release Date>";

        MarketplaceWebServiceConfig config = new MarketplaceWebServiceConfig();
        
        config.setServiceURL("https://mws.amazonservices.in/");
        
        MarketplaceWebService service = new MarketplaceWebServiceClient(
                accessKeyId, secretAccessKey, null, null, config);
        
        final String merchantId = "A1ZRT2O38J6EA0";
        final String sellerDevAuthToken = "amzn.mws.84b81f01-9bc9-b3a3-2883-b22dfc15b070";

        GetFeedSubmissionCountRequest request = new GetFeedSubmissionCountRequest();
        request.setMerchant( merchantId );
        request.setMWSAuthToken(sellerDevAuthToken);
        request.setMarketplace("A21TJRUUN4KGV");
        
        String res=invokeGetFeedSubmissionCount(service, request);
        
        return res;
	}
}
