package com.connect2.ec.adapter.ec.eb.service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.connect2.ec.adapter.ec.eb.accessToken.api.client.auth.oauth2.CredentialUtil;
import com.connect2.ec.adapter.ec.eb.accessToken.api.client.auth.oauth2.OAuth2Api;
import com.connect2.ec.adapter.ec.eb.accessToken.api.client.auth.oauth2.model.Environment;
import com.connect2.ec.adapter.ec.eb.accessToken.api.client.auth.oauth2.model.OAuthResponse;
import com.connect2.ec.adapter.ec.eb.bean.EbayProduct;
import com.connect2.ec.domain.C2IEcProduct;

@Service
public class EbayEcomBaseService {

	public static OAuthResponse getApplicationToken(List<String>scopes) throws IOException {
		OAuth2Api oauth2Api = new OAuth2Api();
		try {
			CredentialUtil.load(new FileInputStream("./client/auth/oauth2/config.yaml"));
		} catch (FileNotFoundException e) {
			System.out.println("Config File Not Found");
			e.printStackTrace();
		}
		//ON WHICH THE ACCESS TOKEN WILL BE VALID..ONCE THE DEVELOPER ACCOUNT IS REVIEWED
		Optional<String> state=null;
		String URL=oauth2Api.generateUserAuthorizationUrl(Environment.SANDBOX, scopes, state);
		//REDIRECT THE USER TO THE ABOVE URL TO GET CONSENT AND IT RETURNS AN AUTHORIZATION CODE
		//RETURN THE AUTHORIZATION TOKEN
		
		
//		OAuthResponse oauthResponse=oauth2Api.getApplicationToken(Environment.SANDBOX, scopes);
		return null;
	}
	
	public static EbayProduct C2IProductToEbayProduct(C2IEcProduct c2iProduct) {
		EbayProduct ebayProduct=new EbayProduct();
		
		return ebayProduct;
	}
}
