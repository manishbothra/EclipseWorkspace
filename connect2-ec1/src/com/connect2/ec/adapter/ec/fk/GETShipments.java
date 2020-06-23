package com.connect2.ec.adapter.ec.fk;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;


public class GETShipments{

	static String serviceUrl="https://api.flipkart.net/sellers";
	static String api;
	
//	static GETToken token = new GETToken();
	static String app_id = "b34aa47b29284b0aba240698791643881403";
	static String app_secret = "274077e56677c2c34a94fb0cdd2bacff0";
		
	public static void getShipmentsByShipmentID(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments?shipmentIds={}";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
	public static void getShipmentsByOrderItemIds(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments?orderItemIds={}";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
	
	public static void getShipmentsByOrderIds(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments?orderIds={}";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
	public static void getShipmentsLabels(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments/{shipmentIds}/labels";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
	public static void getShipmentsInvoices(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments/{shipmentIds}/invoices";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	public static void getShipmentsByShipmentIDs(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments/{shipmentIds}";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
//	public static void getShipmentForm(String app_id, String app_secret) {
//		 try{
//			  api = "/v3/shipments/{shipmentIds}/forms";
//			  HttpClient client = new DefaultHttpClient();
//	          HttpGet request = new HttpGet(serviceUrl + api);
//	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
//	   
//	          HttpResponse response = client.execute(request);
//
//	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
//	         
//	          
//	          StringBuilder builder = new StringBuilder();
//
//	          String line;
//
//	          while ((line = bufReader.readLine()) != null) {
//
//	              builder.append(line);
//	              builder.append(System.lineSeparator());
//	          }
//	                    
//
//	          System.out.println(builder);
//	          
//		 }catch(Exception e) {
//		   
//	     }
//	
//	 }
	
	
	public static void getReturns(String app_id, String app_secret) {
		 try{
			  api = "/v2/returns?source={source_mode}&modifiedAfter={date}&createdAfter={date}&locationId={locationId}";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	          request.setHeader("source", "");
	          request.setHeader("modifiedAfter", "");
	          request.setHeader("createdAfter", "");
	          request.setHeader("locationId", "");
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
	
	public static void getReturnsByReturnIds(String app_id, String app_secret) {
		 try{
			  api = "/v2/returns?returnIds={id list}";


			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
	public static void getVendorShipments(String app_id, String app_secret) {
		 try{
			  api = "/v3/shipments/handover/counts?locationId={location_id}";
			  HttpClient client = new DefaultHttpClient();
	          HttpGet request = new HttpGet(serviceUrl + api);
	          request.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36");
//	          request.setHeader("Authorization", "Bearer " + token.getAccessToken(app_id, app_secret));
	   
	          HttpResponse response = client.execute(request);

	          BufferedReader bufReader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	         
	          
	          StringBuilder builder = new StringBuilder();

	          String line;

	          while ((line = bufReader.readLine()) != null) {

	              builder.append(line);
	              builder.append(System.lineSeparator());
	          }
	                    

	          System.out.println(builder);
	          
		 }catch(Exception e) {
		   
	     }
	
	 }
	
	
}
	
	
