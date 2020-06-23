package com.connect2.ec.adapter.ec.fk;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connect2.ec.dao.C2IEcommerceDao;
import com.google.gson.Gson;

//@RestController
//@RequestMapping("/ecomm/notifications/flipkart")
public class FlipkartNotificationsController{
//	
	@Autowired
	private C2IEcommerceDao c2iEcDao;
	
	private final Logger logger = LoggerFactory.getLogger(FlipkartNotificationsController.class);

//	@RequestMapping("/receive")
	public void notification(@RequestBody JSONObject note, HttpServletRequest request){
		FKNotification fnote=null;
		try {
				 
				if(authenticate(request)){
					fnote = new Gson().fromJson(note.toString(), FKNotification.class);
					
					String eventType = fnote.getEventType();
					
					if(eventType.equalsIgnoreCase("shipment_created")) {
						c2iEcDao.insertOrderDetails(note);
						c2iEcDao.insertOrderItemDetails(note);
						logger.info(note.toString());
					}else if(eventType.equalsIgnoreCase("shipment_hold")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_unhold")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_packed")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_unhold")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_ready_to_dispatch")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_pickup_complete")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_shipped")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_delivered")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_dispatch_dates_changed")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_cancelled")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("shipment_form_failed")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("return_created")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("return_created")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("return_expected_date_changed")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("return_completed")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("return_cancelled")) {
						c2iEcDao.insertOrderDetails(note);
					}else if(eventType.equalsIgnoreCase("return_item_tracking_id_update")) {
						c2iEcDao.insertOrderDetails(note);
					}
				}else {
					System.out.println("Authentication failed");
					logger.info("Authentication Failed");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		
//		return fnote;
	}
	
//	@RequestMapping("/authenticate")
	public boolean authenticate(HttpServletRequest request) {
	
		String oAuthSecret=null;
		String X_Date=request.getHeader("X_Date");
		String X_Authorization=request.getHeader("X_Authorization");
		
		boolean status=false;
		
		String signature = X_Date + "https://connect2india.com/ecomm/notifications/authenticate" + "POST" + oAuthSecret;
		
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("SHA-1");
			
			 byte[] messageDigest = md.digest(signature.getBytes()); 

	         BigInteger no = new BigInteger(1, messageDigest); 

	         String hashtext = no.toString(16); 
	 
	         while (hashtext.length() < 32) { 
	             hashtext = "0" + hashtext; 
	         } 
	         
	         if(X_Authorization.equals(hashtext)) {
	        	 status=true;
	        	 
	         }
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} 
		return status;
	}
	
}