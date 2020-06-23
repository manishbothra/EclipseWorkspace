package com.connect2.ec.adapter.ec.am.bean;

import com.connect2.ec.adapter.ec.am.model.IdList;

public class CredentialsBean{
	
	private String accessKeyId;
	private String secretAccessKey;
	private String appName;
	private String appVersion;
	
	private String merchantId;
	
	private String sellerDevAuthToken;
	
	private String inputFilePath;
	private String serviceURL;
	private IdList marketplaces = new IdList();
	private String feedType;
	
	
	public String getAccessKeyId() {
		return accessKeyId;
	}
	public void setAccessKeyId(String accessKeyId) {
		this.accessKeyId = accessKeyId;
	}
	public String getSecretAccessKey() {
		return secretAccessKey;
	}
	public void setSecretAccessKey(String secretAccessKey) {
		this.secretAccessKey = secretAccessKey;
	}
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public String getAppVersion() {
		return appVersion;
	}
	public void setAppVersion(String appVersion) {
		this.appVersion = appVersion;
	}
	public String getMerchantId() {
		return merchantId;
	}
	public void setMerchantId(String merchantId) {
		this.merchantId = merchantId;
	}
	public String getSellerDevAuthToken() {
		return sellerDevAuthToken;
	}
	public void setSellerDevAuthToken(String sellerDevAuthToken) {
		this.sellerDevAuthToken = sellerDevAuthToken;
	}
	public String getInputFilePath() {
		return inputFilePath;
	}
	public void setInputFilePath(String inputFilePath) {
		this.inputFilePath = inputFilePath;
	}
	public String getServiceURL() {
		return serviceURL;
	}
	public void setServiceURL(String serviceURL) {
		this.serviceURL = serviceURL;
	}
	public IdList getMarketplaces() {
		return marketplaces;
	}
	public void setMarketplaces(IdList marketplaces) {
		this.marketplaces = marketplaces;
	}
	public String getFeedType() {
		return feedType;
	}
	public void setFeedType(String feedType) {
		this.feedType = feedType;
	}
	
	
	
}