package com.connect2.ec.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.connect2.ec.constants.ECType;

public class C2IEcProduct {

	private int ecProdId;
	private int ecStoreId;
	private int companyId;
	private String sku;
	private String productId;
	private String productIdType;
	private String productName;
	private String brand;

	private String categoryId;
	private String category1;
	private String category2;
	private String mainCategory;

	private double packageLength;
	private double packageBreadth;
	private double packageHeight;
	private double packageWeight;
	
	private int stock;
	private String locationId;
	private long stockAvailableForBuyers;
	private String hsn;
	private String luxuryCess;
	private String taxCode;
	private String marketplace;
	
	private String manufacturerDetails;
	private String importerDetails;
	private String packerDetails;
	private String countryOfOrigin;

	private String manufacturingDate;
	private double shelfLife;
	
	private C2IEcProductImage ImageDoc;
	
	private C2IEcProdSellingInfo sellingInfo;

	private Map<Object, Object> productSpecifications = new HashMap<Object, Object>();
	private Map<Object, Object> additionalDetails = new HashMap<Object, Object>();
	
	private List<ECType> ecStoreTypes;

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public int getCompanyId() {
		return companyId;
	}

	public void setCompanyId(int companyId) {
		this.companyId = companyId;
	}

	public int getEcProdId() {
		return ecProdId;
	}

	public void setEcProdId(int ecProdId) {
		this.ecProdId = ecProdId;
	}

	public int getEcStoreId() {
		return ecStoreId;
	}

	public void setEcStoreId(int ecStoreId) {
		this.ecStoreId = ecStoreId;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getMainCategory() {
		return mainCategory;
	}

	public void setMainCategory(String mainCategory) {
		this.mainCategory = mainCategory;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public String getLocationId() {
		return locationId;
	}

	public void setLocationId(String locationId) {
		this.locationId = locationId;
	}

	public String getHsn() {
		return hsn;
	}

	public void setHsn(String hsn) {
		this.hsn = hsn;
	}

	public String getLuxuryCess() {
		return luxuryCess;
	}

	public void setLuxuryCess(String luxuryCess) {
		this.luxuryCess = luxuryCess;
	}

	public String getTaxCode() {
		return taxCode;
	}

	public void setTaxCode(String taxCode) {
		this.taxCode = taxCode;
	}

	public String getMarketplace() {
		return marketplace;
	}

	public void setMarketplace(String marketplace) {
		this.marketplace = marketplace;
	}

	public String getManufacturerDetails() {
		return manufacturerDetails;
	}

	public void setManufacturerDetails(String manufacturerDetails) {
		this.manufacturerDetails = manufacturerDetails;
	}

	public String getImporterDetails() {
		return importerDetails;
	}

	public void setImporterDetails(String importerDetails) {
		this.importerDetails = importerDetails;
	}

	public String getPackerDetails() {
		return packerDetails;
	}

	public void setPackerDetails(String packerDetails) {
		this.packerDetails = packerDetails;
	}

	public String getCountryOfOrigin() {
		return countryOfOrigin;
	}

	public void setCountryOfOrigin(String countryOfOrigin) {
		this.countryOfOrigin = countryOfOrigin;
	}

	public C2IEcProdSellingInfo getSellingInfo() {
		return sellingInfo;
	}

	public void setSellingInfo(C2IEcProdSellingInfo sellingInfo) {
		this.sellingInfo = sellingInfo;
	}

	

	public Map<Object, Object> getProductSpecifications() {
		return productSpecifications;
	}

	public void setProductSpecifications(Map<Object, Object> productSpecifications) {
		this.productSpecifications = productSpecifications;
	}

	public Map<Object, Object> getAdditionalDetails() {
		return additionalDetails;
	}

	public void setAdditionalDetails(Map<Object, Object> additionalDetails) {
		this.additionalDetails = additionalDetails;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getCategory1() {
		return category1;
	}

	public void setCategory1(String category1) {
		this.category1 = category1;
	}

	public String getCategory2() {
		return category2;
	}

	public void setCategory2(String category2) {
		this.category2 = category2;
	}

	public String getProductIdType() {
		return productIdType;
	}

	public void setProductIdType(String productIdType) {
		this.productIdType = productIdType;
	}



	public long getStockAvailableForBuyers() {
		return stockAvailableForBuyers;
	}

	public void setStockAvailableForBuyers(long stockAvailableForBuyers) {
		this.stockAvailableForBuyers = stockAvailableForBuyers;
	}

	

	public String getManufacturingDate() {
		return manufacturingDate;
	}

	public void setManufacturingDate(String manufacturingDate) {
		this.manufacturingDate = manufacturingDate;
	}



	public double getPackageLength() {
		return packageLength;
	}

	public void setPackageLength(double packageLength) {
		this.packageLength = packageLength;
	}

	public double getPackageBreadth() {
		return packageBreadth;
	}

	public void setPackageBreadth(double packageBreadth) {
		this.packageBreadth = packageBreadth;
	}

	public double getPackageHeight() {
		return packageHeight;
	}

	public void setPackageHeight(double packageHeight) {
		this.packageHeight = packageHeight;
	}

	public double getPackageWeight() {
		return packageWeight;
	}

	public void setPackageWeight(double packageWeight) {
		this.packageWeight = packageWeight;
	}

	public double getShelfLife() {
		return shelfLife;
	}

	public void setShelfLife(double shelfLife) {
		this.shelfLife = shelfLife;
	}

	public C2IEcProductImage getImageDoc() {
		return ImageDoc;
	}

	public void setImageDoc(C2IEcProductImage imageDoc) {
		ImageDoc = imageDoc;
	}

	public List<ECType> getEcStoreTypes() {
		return ecStoreTypes;
	}

	public void setEcStoreTypes(List<ECType> ecStoreTypes) {
		this.ecStoreTypes = ecStoreTypes;
	}
	
	
	
}
