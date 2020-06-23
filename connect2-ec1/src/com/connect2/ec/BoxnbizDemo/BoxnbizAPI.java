package com.connect2.ec.BoxnbizDemo;

import java.io.*;
import java.util.*;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONArray;
import org.json.JSONObject;

import com.gargoylesoftware.htmlunit.javascript.host.Map;



public class BoxnbizAPI {
	
	static void login_get_token() throws Exception{
		JSONObject json=new JSONObject();
		json.put("email_id","yogesh.garg@connect2india.com");
		json.put("password","yogesh@123");
		json.put("api_key","57c50e-27f0d2-b00e8f-9ed0e5-19c6e8");
		
		StringEntity entity=new StringEntity(json.toString(),  "UTF-8");
		String url="https://demo.api.boxnbiz.com/v1/login/get-token";
		HttpPost httppost=new HttpPost(url);
		httppost.addHeader("Content-Type", "application/json");
		httppost.setEntity(entity);
		DefaultHttpClient httpClient = new DefaultHttpClient();
		HttpResponse response = httpClient.execute(httppost);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
		
	}
	private static String inquiry_id,inquiry_type;
	static void inquiry_submit_inquiry() throws Exception {
		JSONObject json=new JSONObject();
		json.put("company_id", "ICONN660");
		json.put("shipper_person_id", "ICONN660");
		json.put("trade_type", "Export");
		json.put("mode", "Air");
		json.put("incoterms", "FOB");
		json.put("pickup", "Mumbai,India");
		json.put("pol", "BOM");//India
		json.put("pod", "JFK");//US
		json.put("delivery", "NewYork, USA");
		json.put("pickup_service", "N");
		json.put("origin_handling", "N");
		json.put("origin_cha", "N");
		json.put("delivery_service", "N");
		json.put("destination_handling", "N");
		json.put("destination_cha", "N");
		json.put("gross_weight", 2);
		json.put("gross_weight_unit", "KG");
		json.put("commodity", "Steel");
		json.put("expected_pickup_Date", "15/06/2020");
		json.put("lcl_package_quantity", 0);
		json.put("lcl_package_type", "Box");
		json.put("fcl_container_quantity", 0);
		json.put("fcl_container_type", "Null");
		json.put("fcl_container_size", "Null");
		json.put("fcl_container_stuffing", "Null");
		json.put("cargo_type", "Non-HAZ");
		JSONArray dtos = new JSONArray();
		
		JSONObject dto = new JSONObject();
		dto.put("length",1);
		dto.put("width",2);
		dto.put("height",4);
		dto.put("quantity",5);
		dto.put("unit","cm");
		dto.put("air_load_type","Air");
		dtos.put(dto);
		json.put("dimensionDtos", dtos);
		json.put("special_instruction", "No");
		StringEntity entity=new StringEntity(json.toString(),  "UTF-8");
		String url="https://demo.api.boxnbiz.com/v1/inquiry/submit-inquiry";
		HttpPost httppost=new HttpPost(url);
		httppost.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httppost.addHeader("Content-Type", "application/json");
		httppost.setEntity(entity);
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httppost);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        HashMap<String,String> map=new HashMap<>();
        //map.put("vdff","fhjf");
        while ((line=in.readLine())!=null){
        	//line=line.substring(1,line.length()-1);
        	System.out.println(line);
        	JSONObject j1=new JSONObject(line);
            inquiry_id=(String)j1.get("inquiry_id");
            inquiry_type=(String)j1.get("inquiry_type");
            System.out.println(inquiry_id+" "+inquiry_type);
//        	String a[]=line.split(",");
//        	for(int i=0;i<a.length;i++) {
//        		String b[]=a[i].split(":");
//        		map.put(b[0].substring(1,b[0].length()-1),b[1].substring(1,b[1].length()-1));
//        	}
        }
        for(String s:map.keySet()) {
        	System.out.println(s+":"+map.get(s));
        }
	}
	static void inquiry_update_inquiry() throws Exception{
		JSONObject json=new JSONObject();
		json.put("company_id", "ICONN660");
		json.put("shipper_person_id", "ICONN660");
		json.put("trade_type", "Export");
		json.put("mode", "Air");
		json.put("incoterms", "FOB");
		json.put("pickup", "Mumbai,India");
		json.put("pol", "BOM");//India
		json.put("pod", "JFK");//US
		json.put("delivery", "NewYork, USA");
		json.put("pickup_service", "N");
		json.put("origin_handling", "N");
		json.put("origin_cha", "N");
		json.put("delivery_service", "N");
		json.put("destination_handling", "N");
		json.put("destination_cha", "N");
		json.put("gross_weight", 2);
		json.put("gross_weight_unit", "KG");
		json.put("commodity", "Steel");
		json.put("expected_pickup_Date", "15/06/2020");
		json.put("lcl_package_quantity", 0);
		json.put("lcl_package_type", "Box");
		json.put("fcl_container_quantity", 0);
		json.put("fcl_container_type", "Null");
		json.put("fcl_container_size", "Null");
		json.put("fcl_container_stuffing", "Null");
		json.put("cargo_type", "Non-HAZ");
		JSONArray dtos = new JSONArray();
		
		JSONObject dto = new JSONObject();
		dto.put("length",1);
		dto.put("width",2);
		dto.put("height",4);
		dto.put("quantity",5);
		dto.put("unit","cm");
		dto.put("air_load_type","Air");
		//System.out.println(dto);
		//dtos.put(0,dto);
		dtos.put(dto);
		//System.out.println(dtos);
		json.put("dimensionDtos", dtos);
		
		json.put("special_instruction", "No");
		//System.out.println(json);
		
		StringEntity entity=new StringEntity(json.toString(),  "UTF-8");
		String inquiry_id="RFQ000699";
		String url="https://demo.api.boxnbiz.com/v1/inquiry/update-inquiry/"+inquiry_id;
		HttpPut httpput=new HttpPut(url);
		httpput.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpput.addHeader("Content-Type", "application/json");
		httpput.setEntity(entity);
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpput);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void inquiry_upload_msds_file() {
		
	}
	static void inquiry_get_selected_instant_rate() throws Exception{
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		Integer instant_id=9272;
		String url="https://demo.api.boxnbiz.com/v1/inquiry/get-selected-instant-rate/"+inquiry_id+"?company_id="+company_id+"&instant_id="+instant_id;
		HttpGet httpget=new HttpGet(url);
		httpget.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		//httpget.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpget);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void find_instant_rate() {
		
	}
	static void inquiry_check_inquiry_status() throws Exception{
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		String url="https://demo.api.boxnbiz.com/v1/inquiry/check-inquiry-status/"+inquiry_id+"?company_id="+company_id;
		HttpGet httpget=new HttpGet(url);
		httpget.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpget.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpget);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void inquiry_close() throws Exception{
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		String reason="Personal%20Problem";
		String url="https://demo.api.boxnbiz.com/v1/inquiry/close/"+inquiry_id+"?company_id="+company_id+"&feedback="+reason;
		System.out.println(url);
		HttpGet httpget=new HttpGet(url);
		httpget.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpget.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpget);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void inquiry_convert_to_manual() throws Exception {
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		String feedback="Meri%20Marzi";
		String url="https://demo.api.boxnbiz.com/v1/inquiry/convert-to-manual/"+inquiry_id+"?company_id="+company_id+"&feedback="+feedback;
		System.out.println(url);
		HttpGet httpget=new HttpGet(url);
		httpget.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpget.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpget);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void quotation_find_manual_quotation_by_inquiry() throws Exception{
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		String url="https://demo.api.boxnbiz.com/v1/quotation/find-manual-quotation-by-inquiry/"+inquiry_id+"?company_id="+company_id;
 
		System.out.println(url);
		HttpGet httpget=new HttpGet(url);
		httpget.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpget.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpget);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void booking_book_quotation() throws Exception{
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		String quotation_id="null";
		int instant_id=9272;
		String url="https://demo.api.boxnbiz.com/v1/booking/book-quotation?inquiryId="+inquiry_id+"&company_id="+company_id+"&quotationId="+quotation_id+"&instant_id="+0;
		System.out.println(url);
		HttpPost httppost=new HttpPost(url);
		httppost.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httppost.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httppost);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void activity_submit_message() throws Exception{
		JSONObject json=new JSONObject();
		json.put("company_id", "ICONN660");
		json.put("person_id", "ICONN660");
		json.put("inquiry_id", "RFQ000699");
		json.put("title", "Boxnbiz");
		json.put("message", "Thanks for the RFQ, We will get back with the best quote shortly.");
		String url="https://demo.api.boxnbiz.com/v1/activity/submit-message";
		System.out.println(url);
		HttpPost httppost=new HttpPost(url);
		httppost.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httppost.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httppost);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	static void activity_get_inquiry_messages() throws Exception{
		String inquiry_id="RFQ000699";
		String company_id="ICONN660";
		String url="https://demo.api.boxnbiz.com/v1/activity/get-inquiry-messages/"+inquiry_id+"?company_id="+company_id;
		System.out.println(url);
		HttpGet httpget=new HttpGet(url);
		httpget.addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJ5b2dlc2guZ2FyZ0Bjb25uZWN0MmluZGlhLmNvbSIsImlzcyI6InlvZ2VzaEAxMjMiLCJsb2dpblVzZXJJbmZvRHRvIjp7ImlkIjozMDYsInJvbGUiOiJzaGlwcGVyIiwiZW1wbG95ZWVfaWQiOm51bGwsInN1Yl9yb2xlIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJkZXNpZ25hdGlvbiI6bnVsbCwicGFyZW50X2lkIjpudWxsLCJwZXJzb25faWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfaWQiOiJJQ09OTjY2MCIsImNvbXBhbnlfbmFtZSI6IklDT05ORUNUIEJVU0lORVNTIFBSSVZBVEUgTElNSVRFRCIsInBlcnNvbl9uYW1lIjoiWW9nZXNoIEdhcmciLCJlbWFpbF9pZCI6InlvZ2VzaC5nYXJnQGNvbm5lY3QyaW5kaWEuY29tIiwicHJvZmlsZV91cGRhdGVfc3RhdHVzIjoiMCIsInZlcmlmaWNhdGlvbl9jb2RlIjoiMjI4NzMxIiwidmVyaWZpY2F0aW9uX3N0YXR1cyI6Ik4iLCJtb2JpbGVfbm8iOiI4ODYwMTQ5ODM2IiwiYWN0aXZlIjoiWSIsInRva2VuIjpudWxsLCJtc2ciOm51bGx9LCJpYXQiOjE1OTE5NDIxMDB9.YxU3M21SHLivKqJ-JD8ktfr6pReFhNVE-LLCmbH3aJs");
		//httppost.addHeader("message",null);
		httpget.addHeader("Content-Type", "application/json");
		DefaultHttpClient httpclient=new DefaultHttpClient();
		HttpResponse response=httpclient.execute(httpget);
		BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String line="";
        while ((line=in.readLine())!=null){
        	System.out.println(line);
        }
	}
	public static void main(String [] args) throws Exception {
		//login_get_token();//done
		//inquiry_submit_inquiry();//done
		//inquiry_update_inquiry();//done
		//inquiry_upload_msds_file();//required msd file
		//inquiry_get_selected_instant_rate();//Not working due to instant id
		//find_instant_rate();//Not working, needs instant inquiry id
		//inquiry_check_inquiry_status();//done
		//inquiry_close();//done
		//inquiry_convert_to_manual();//needs inquiry id starting with INS i.e instant id
		//quotation_find_manual_quotation_by_inquiry();//getting null values
		//booking_book_quotation();//needs inquiry_id INS
		activity_submit_message();//getting client error
		//activity_get_inquiry_messages();//done
		
	}
	
}
