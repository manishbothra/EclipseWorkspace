package com.connect2.ec.adapter.ec.am;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;

import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.model.FeedSubmissionInfo;
import com.connect2.ec.adapter.ec.am.model.IdList;
import com.connect2.ec.adapter.ec.am.model.ResponseMetadata;
import com.connect2.ec.adapter.ec.am.model.SubmitFeedRequest;
import com.connect2.ec.adapter.ec.am.model.SubmitFeedResponse;
import com.connect2.ec.adapter.ec.am.model.SubmitFeedResult;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebService;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceClient;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceConfig;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceException;

public class SubmitFeed {
	
	public static HashMap<Object,Object> submitProduct(CredentialsBean credentials) throws NoSuchAlgorithmException, IOException {
		
		final String inputFilePath =credentials.getInputFilePath();
    	System.out.println(inputFilePath);
		FileInputStream inputXML = new FileInputStream(inputFilePath);
		String md5Content = computeContentMD5Value(inputXML);
		
		
		final String accessKeyId = credentials.getAccessKeyId();
        final String secretAccessKey = credentials.getSecretAccessKey();

        final String appName = credentials.getAppName();
        final String appVersion = credentials.getAppVersion();
        
        final String merchantId = credentials.getMerchantId();
        final String sellerDevAuthToken = credentials.getSellerDevAuthToken();
        final String feedType = credentials.getFeedType();
        
        MarketplaceWebServiceConfig config = new MarketplaceWebServiceConfig();

        config.setServiceURL(credentials.getServiceURL());
        MarketplaceWebService service = new MarketplaceWebServiceClient(accessKeyId, secretAccessKey, appName, appVersion, config);
        
        final IdList marketplaces = credentials.getMarketplaces();

        SubmitFeedRequest request = new SubmitFeedRequest();
        request.setMerchant(merchantId);
        request.setMWSAuthToken(sellerDevAuthToken);
        request.setMarketplaceIdList(marketplaces);
        request.setContentMD5(md5Content);
        request.setFeedType(feedType);
        request.setFeedContent( new FileInputStream(inputFilePath));
        
        HashMap<Object,Object> result=invokeSubmitFeed(service, request);
        
        return result;
		
	}
	
	public static String computeContentMD5Value( FileInputStream fis ) throws IOException, NoSuchAlgorithmException {

	    DigestInputStream dis = new DigestInputStream( fis, MessageDigest.getInstance( "MD5" ));

	    byte[] buffer = new byte[8192];
	    while( dis.read( buffer ) > 0 );
//	    org.apache.commons.codec.binary.
	    String md5Content = new String(Base64.encodeBase64(dis.getMessageDigest().digest()) ); 

	    // Effectively resets the stream to be beginning of the file
	    // via a FileChannel.
	    fis.getChannel().position( 0 );
	    
	    return md5Content;
	}
	
	public static HashMap<Object,Object> invokeSubmitFeed(MarketplaceWebService service,SubmitFeedRequest request) {
		boolean res=false;
		String feedSubID="";
		HashMap<Object,Object> result= new HashMap<Object,Object>();
		try {
	
            SubmitFeedResponse response = service.submitFeed(request);
            
            
            System.out.println("SubmitFeed Action Response");
            System.out
            .println("=============================================================================");
            System.out.println();

            System.out.print("    SubmitFeedResponse");
            System.out.println();
            if (response.isSetSubmitFeedResult()) {
                System.out.print("        SubmitFeedResult");
                System.out.println();
                SubmitFeedResult submitFeedResult = response.getSubmitFeedResult();
                if (submitFeedResult.isSetFeedSubmissionInfo()) {
                    System.out.print("            FeedSubmissionInfo");
                    System.out.println();
                    FeedSubmissionInfo feedSubmissionInfo = submitFeedResult.getFeedSubmissionInfo();
                    if (feedSubmissionInfo.isSetFeedSubmissionId()) {
                    	
                    	feedSubID=feedSubmissionInfo.getFeedSubmissionId();
                    	
                        System.out.print("                FeedSubmissionId");
                        System.out.println();
                        System.out.print("                    "+ feedSubmissionInfo.getFeedSubmissionId());
                        System.out.println();
                    }
                    if (feedSubmissionInfo.isSetFeedType()) {
                        System.out.print("                FeedType");
                        System.out.println();
                        System.out.print("                    "+ feedSubmissionInfo.getFeedType());
                        System.out.println();
                    }
                    if (feedSubmissionInfo.isSetSubmittedDate()) {
                        System.out.print("                SubmittedDate");
                        System.out.println();
                        System.out.print("                    "+ feedSubmissionInfo.getSubmittedDate());
                        System.out.println();
                    }
                    if (feedSubmissionInfo.isSetFeedProcessingStatus()) {
                        if(feedSubmissionInfo.getFeedProcessingStatus().equals("_SUBMITTED_")) {
                        	res=true;
                        }
                    	System.out.print("                FeedProcessingStatus");
                        System.out.println();
                        System.out.print("                    "+ feedSubmissionInfo.getFeedProcessingStatus());
                        System.out.println();
                    }
                    if (feedSubmissionInfo.isSetStartedProcessingDate()) {
                        System.out
                        .print("                StartedProcessingDate");
                        System.out.println();
                        System.out
                        .print("                    "+ feedSubmissionInfo.getStartedProcessingDate());
                        System.out.println();
                    }
                    if (feedSubmissionInfo.isSetCompletedProcessingDate()) {
                        System.out
                        .print("                CompletedProcessingDate");
                        System.out.println();
                        System.out.print("                    "+ feedSubmissionInfo.getCompletedProcessingDate());
                        System.out.println();
                    }
                }
            }
            if (response.isSetResponseMetadata()) {
                System.out.print("        ResponseMetadata");
                System.out.println();
                ResponseMetadata responseMetadata = response
                .getResponseMetadata();
                if (responseMetadata.isSetRequestId()) {
                    System.out.print("            RequestId");
                    System.out.println();
                    System.out.print("                "+ responseMetadata.getRequestId());
                    System.out.println();
                }
            }
            System.out.println(response.getResponseHeaderMetadata());
            System.out.println();
            System.out.println();
            
        } catch (MarketplaceWebServiceException ex) {

        	//ex.printStackTrace();
            System.out.println("Caught Exception: " + ex.getMessage());
            System.out.println("Response Status Code: " + ex.getStatusCode());
            System.out.println("Error Code: " + ex.getErrorCode());
            System.out.println("Error Type: " + ex.getErrorType());
            System.out.println("Request ID: " + ex.getRequestId());
            System.out.print("XML: " + ex.getXML());
            System.out.println("ResponseHeaderMetadata: " + ex.getResponseHeaderMetadata());
        }
		result.put("feedSubID",feedSubID);
		result.put("result", res);
		return result;
    }
}
