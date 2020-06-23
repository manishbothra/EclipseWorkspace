package com.connect2.ec.adapter.ec.fk;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.connect2.ec.dao.C2IEcommerceDao;
import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.utility.HttpConnector;
import com.connect2.utility.HttpConnector.Response;

@Service
//@PropertySource("classpath:/ec-config.properties")
public class FlipkartEcommBaseService {
	
	@Autowired
	private C2IEcommerceDao c2iEcDao;
	
	protected static String serviceUrl = "https://api.flipkart.net/sellers";
	
	private final Logger logger = LoggerFactory.getLogger(FlipkartEcommBaseService.class);
	
	protected String getAccessToken() throws IOException, JSONException {
		String app_id="",app_secret="";
		try {
			C2IEcSeller ecSeller = c2iEcDao.getSellerDetails();
			
			app_id= ecSeller.getAppId();
			app_secret = ecSeller.getAppSecret();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		String access_token = "";
		System.out.println("Getting Token");

		String stringUrl = "https://api.flipkart.net/oauth-service/oauth/token?grant_type=client_credentials&client_id="
				+ "&client_secret=&scope=Seller_Api";

		String userpass = app_id + ":" + app_secret;
		String basicAuth = "Basic " + new String(new Base64().encode(userpass.getBytes()));

		Map<String, String> headers = new HashMap<String, String>();
		headers.put("X-Requested-With", "Curl");
		headers.put("Authorization", basicAuth);

		Response response = HttpConnector.connectServer(stringUrl, "GET", null, null, headers);
		if (!StringUtils.isEmpty(response.getResponse())) {
			JSONObject outputJSON = new JSONObject(response.getResponse());
			access_token = outputJSON.getString("access_token");
			System.out.println("Token Received");
		}

		return access_token;
	}
}
