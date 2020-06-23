package com.connect2.ec.domain;

import java.util.List;

import com.connect2.ec.constants.ECType;

public class C2IEcStore {
	private long ecStoreId;
	private String storeName;
	private String storeLogoUrl;
	private long companyId;
	private String sellerEmail;
	private String sellerContact;
	private String sellerName;
	private String sellerPassword;
	private String pickUpAddress;
	private int pickUpPincode;
	private String gstinNumber;
	private String businessName;
	private String panNumber;
	private String businessType;
	private String addressLine1;
	private String addressLine2;
	private String pincode;
	private String city;
	private String state;
	private int bankAccountNumber;
	private String bankName;
	private String ifsc;
	private String status;
	private String dateCreated;
	private List<ECType> ecStoreTypes;
	private C2IEcStoreDocs c2iEcStoreDocs;
	
	public long getEcStoreId() {
		return ecStoreId;
	}
	public void setEcStoreId(long ecStoreId) {
		this.ecStoreId = ecStoreId;
	}
	public String getStoreName() {
		return storeName;
	}
	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}
	public String getStoreLogoUrl() {
		return storeLogoUrl;
	}
	public void setStoreLogoUrl(String storeLogoUrl) {
		this.storeLogoUrl = storeLogoUrl;
	}
	public long getCompanyId() {
		return companyId;
	}
	public void setCompanyId(long companyId) {
		this.companyId = companyId;
	}
	public String getSellerEmail() {
		return sellerEmail;
	}
	public void setSellerEmail(String sellerEmail) {
		this.sellerEmail = sellerEmail;
	}
	public String getSellerContact() {
		return sellerContact;
	}
	public void setSellerContact(String sellerContact) {
		this.sellerContact = sellerContact;
	}
	public String getSellerName() {
		return sellerName;
	}
	public void setSellerName(String sellerName) {
		this.sellerName = sellerName;
	}
	
	public String getSellerPassword() {
		return sellerPassword;
	}
	public void setSellerPassword(String sellerPassword) {
		this.sellerPassword = sellerPassword;
	}
	public String getGstinNumber() {
		return gstinNumber;
	}
	public void setGstinNumber(String gstinNumber) {
		this.gstinNumber = gstinNumber;
	}
	public String getBusinessName() {
		return businessName;
	}
	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}
	public String getPanNumber() {
		return panNumber;
	}
	public void setPanNumber(String panNumber) {
		this.panNumber = panNumber;
	}
	public String getBusinessType() {
		return businessType;
	}
	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}
	public String getAddressLine1() {
		return addressLine1;
	}
	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}
	public String getAddressLine2() {
		return addressLine2;
	}
	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}
	public String getPincode() {
		return pincode;
	}
	public void setPincode(String pincode) {
		this.pincode = pincode;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public int getBankAccountNumber() {
		return bankAccountNumber;
	}
	public void setBankAccountNumber(int bankAccountNumber) {
		this.bankAccountNumber = bankAccountNumber;
	}
	public String getBankName() {
		return bankName;
	}
	public void setBankName(String bankName) {
		this.bankName = bankName;
	}
	public String getIfsc() {
		return ifsc;
	}
	public void setIfsc(String ifsc) {
		this.ifsc = ifsc;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getDateCreated() {
		return dateCreated;
	}
	public void setDateCreated(String dateCreated) {
		this.dateCreated = dateCreated;
	}
	
	public String getPickUpAddress() {
		return pickUpAddress;
	}
	public void setPickUpAddress(String pickUpAddress) {
		this.pickUpAddress = pickUpAddress;
	}
	public int getPickUpPincode() {
		return pickUpPincode;
	}
	public void setPickUpPincode(int pickUpPincode) {
		this.pickUpPincode = pickUpPincode;
	}
	public C2IEcStoreDocs getC2iEcStoreDocs() {
		return c2iEcStoreDocs;
	}
	public void setC2iEcStoreDocs(C2IEcStoreDocs c2iEcStoreDocs) {
		this.c2iEcStoreDocs = c2iEcStoreDocs;
	}
	public List<ECType> getEcStoreTypes() {
		return ecStoreTypes;
	}
	public void setEcStoreTypes(List<ECType> ecStoreTypes) {
		this.ecStoreTypes = ecStoreTypes;
	}
	
}
