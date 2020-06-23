package com.connect2.ec.adapter.ec.am;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.model.GetReportRequest;
import com.connect2.ec.adapter.ec.am.model.GetReportResponse;
import com.connect2.ec.adapter.ec.am.model.ResponseMetadata;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebService;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceClient;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceConfig;
import com.connect2.ec.adapter.ec.am.service.MarketplaceWebServiceException;
import com.connect2.ec.domain.C2IEcProduct;

public class GetReport {
	public static HashMap<Object,Object> getReport(CredentialsBean credentials,String reportId){

	        /************************************************************************
	         * Access Key ID and Secret Access Key ID, obtained from:
	         * http://aws.amazon.com
	         ***********************************************************************/
	        final String accessKeyId = credentials.getAccessKeyId();
	        final String secretAccessKey = credentials.getSecretAccessKey();

	        final String appName = "";
	        final String appVersion = "";

	        MarketplaceWebServiceConfig config = new MarketplaceWebServiceConfig();

	        /************************************************************************
	         * Uncomment to set the appropriate MWS endpoint.
	         ************************************************************************/
	        // US
	        // config.setServiceURL("https://mws.amazonservices.com/");
	        // UK
	        // config.setServiceURL("https://mws.amazonservices.co.uk/");
	        // Germany
	        // config.setServiceURL("https://mws.amazonservices.de/");
	        // France
	        // config.setServiceURL("https://mws.amazonservices.fr/");
	        // Italy
	        // config.setServiceURL("https://mws.amazonservices.it/");
	        // Japan
	        // config.setServiceURL("https://mws.amazonservices.jp/");
	        // China
	        // config.setServiceURL("https://mws.amazonservices.com.cn/");
	        // Canada
	        // config.setServiceURL("https://mws.amazonservices.ca/");
	        // India
	         config.setServiceURL("https://mws.amazonservices.in/");

	        /************************************************************************
	         * You can also try advanced configuration options. Available options are:
	         *
	         *  - Signature Version
	         *  - Proxy Host and Proxy Port
	         *  - User Agent String to be sent to Marketplace Web Service
	         *
	         ***********************************************************************/

	        /************************************************************************
	         * Instantiate Http Client Implementation of Marketplace Web Service        
	         ***********************************************************************/

	        MarketplaceWebService service = new MarketplaceWebServiceClient(
	                accessKeyId, secretAccessKey, appName, appVersion, config);

	        /************************************************************************
	         * Setup request parameters and uncomment invoke to try out 
	         * sample for Get Report 
	         ***********************************************************************/

	        /************************************************************************
	         * Marketplace and Merchant IDs are required parameters for all 
	         * Marketplace Web Service calls.
	         ***********************************************************************/
	        final String merchantId = credentials.getMerchantId();
	        final String sellerDevAuthToken = credentials.getSellerDevAuthToken();

	        GetReportRequest request = new GetReportRequest();
	        request.setMerchant( merchantId );
	        request.setMWSAuthToken(sellerDevAuthToken);

	        request.setReportId(reportId);
			

	        // Note that depending on the type of report being downloaded, a report can reach 
	        // sizes greater than 1GB. For this reason we recommend that you _always_ program to
	        // MWS in a streaming fashion. Otherwise, as your business grows you may silently reach
	        // the in-memory size limit and have to re-work your solution.
	        
//	         OutputStream report = new FileOutputStream( "report.xml" );
//	         request.setReportOutputStream( report );
	        File file=new File("C:\\Users\\Shashank\\git\\c2i-ec\\connect2-ec\\src\\main\\java\\com\\connect2\\ec\\adapter\\ec\\am\\xml\\report.txt");
	        OutputStream report=null;
	        try {
				report = new FileOutputStream(file);
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        
	        request.setReportOutputStream( report );
	        invokeGetReport(service, request);
	        return null;

	    }



	    /**
	     * Get Report  request sample
	     * The GetReport operation returns the contents of a report. Reports can potentially be
	     * very large (>100MB) which is why we only return one report at a time, and in a
	     * streaming fashion.
	     *   
	     * @param service instance of MarketplaceWebService service
	     * @param request Action to invoke
	     * @throws IOException 
	     */
	    public static List<C2IEcProduct> invokeGetReport(MarketplaceWebService service, GetReportRequest request) {
	    	List<C2IEcProduct> products=null;
	    	
	    	try {

	            GetReportResponse response = service.getReport(request);
	            
	            String thisLine="";
	            File file=new File("C:\\Users\\Shashank\\git\\c2i-ec\\connect2-ec\\src\\main\\java\\com\\connect2\\ec\\adapter\\ec\\am\\xml\\report.txt");
		        
	            FileInputStream fis = new FileInputStream(file);
	            DataInputStream myInput = new DataInputStream(fis);
	            
	            List<String[]> lines = new ArrayList<String[]>();
	            while ((thisLine = myInput.readLine()) != null) {
	                 lines.add(thisLine.split("	"));
	            }

	            // convert our list to a String array.
	            String[][] array = new String[lines.size()][0];
	            lines.toArray(array);
	            
	            products=new ArrayList<C2IEcProduct>();
	            for(int i=1;i<array.length;i++) {
	            	C2IEcProduct c2iProduct=new C2IEcProduct();
	            	for(int j=0;j<array[i].length;j++) {
	            		if(array[0][j]=="item-name") {
	            			if(array[i][j]!=null) {
	            				c2iProduct.setProductName(array[i][j]);
	            			}
	            		}
	            		else if(array[0][j]=="item-description") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="listing-id") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="seller-sku") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="price") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="quantity") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="open-date") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="item-is-marketplace") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="product-id-type") {
	            			if(array[i][j]!=null) {
	            				c2iProduct.setProductIdType(array[i][j]);
	            			}
	            		}
	            		else if(array[0][j]=="zshop-shipping-fee") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="item-note") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="item-condition") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="zshop-category1") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="zshop-browse-path") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct;
	            			}
	            		}
	            		else if(array[0][j]=="zshop-storefront-feature") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="asin1") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="asin2") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="asin3") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="will-ship-internationally") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="expedited-shipping") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="zshop-boldface") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="product-id") {
	            			if(array[i][j]!=null) {
	            				c2iProduct.setProductId(array[i][j]);
	            			}
	            		}
	            		else if(array[0][j]=="bid-for-featured-placement") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="add-delete") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="pending-quantity") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="fulfillment-channel") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="optional-payment-type-exclusion") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="merchant-shipping-group") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="status") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
	            		else if(array[0][j]=="maximum-retail-price") {
	            			if(array[i][j]!=null) {
//	            				c2iProduct
	            			}
	            		}
//	            		System.out.println(array[i][j]+" ||| ");
	            	}
//	            	System.out.println(" 1 ");
	            	products.add(c2iProduct);
	            }
	            
//	            System.out.println(lines);
//	            for (int i = 0; i < lines.size(); i++) {
//	                String[] strings = lines.get(i);
//	                for (int j = 0; j < strings.length; j++) {
//	                    System.out.print(strings[j] + " ");
////	                    break;
//	                }
//	                System.out.println();
//	            }

	            System.out.println ("GetReport Action Response");
	            System.out.println ("=============================================================================");
	            System.out.println ();

	            System.out.print("    GetReportResponse");
	            System.out.println();
	            System.out.print("    GetReportResult");
	            System.out.println();
	            System.out.print("            MD5Checksum");
	            System.out.println();
	            System.out.print("                " + response.getGetReportResult().getMD5Checksum());
	            System.out.println();
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

	            System.out.println("Report");
	            System.out.println ("=============================================================================");
	            System.out.println();
	            System.out.println( request.getReportOutputStream().toString() );
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
	        } catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    	return products;
	        
	    }
}
