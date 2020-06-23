package com.connect2.ec.domain;

import java.util.ArrayList;
import java.util.List;

public class C2IEcSeller {

	private int ecSellerId;
	private String username;
	private String password;
	private String appId;
	private String appSecret;
	private String merchantId;
	private String mwsAuthToken;
	private String locationId;
	private List<String> marketplaces = new ArrayList<String>();
	
	public int getEcSellerId() {
		return ecSellerId;
	}
	public void setEcSellerId(int ecSellerId) {
		this.ecSellerId = ecSellerId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getAppSecret() {
		return appSecret;
	}
	public void setAppSecret(String appSecret) {
		this.appSecret = appSecret;
	}
	public String getMerchantId() {
		return merchantId;
	}
	public void setMerchantId(String merchantId) {
		this.merchantId = merchantId;
	}
	public String getMwsAuthToken() {
		return mwsAuthToken;
	}
	public void setMwsAuthToken(String mwsAuthToken) {
		this.mwsAuthToken = mwsAuthToken;
	}
	public String getLocationId() {
		return locationId;
	}
	public void setLocationId(String locationId) {
		this.locationId = locationId;
	}
	public List<String> getMarketplaces() {
		return marketplaces;
	}
	public void setMarketplaces(List<String> marketplaces) {
		this.marketplaces = marketplaces;
	}

	
	
}
