package com.connect2.ec.domain;

public class C2IEcDashboard{
	
	
	private int ecId;
	private String ecName;
	private long totalProducts;
	private long totalActiveProducts;
	private long totalOutOfStockProducts;
	private double totalOrderValues;
	private double lastOrderValue;
	private long totalReturns;
	private long totalOrdersCount;
	private String dateUpdated;
	
	public int getEcId() {
		return ecId;
	}
	public void setEcId(int ecId) {
		this.ecId = ecId;
	}
	public String getEcName() {
		return ecName;
	}
	public void setEcName(String ecName) {
		this.ecName = ecName;
	}
	public long getTotalProducts() {
		return totalProducts;
	}
	public void setTotalProducts(long totalProducts) {
		this.totalProducts = totalProducts;
	}
	public long getTotalActiveProducts() {
		return totalActiveProducts;
	}
	public void setTotalActiveProducts(long totalActiveProducts) {
		this.totalActiveProducts = totalActiveProducts;
	}
	
	public long getTotalOutOfStockProducts() {
		return totalOutOfStockProducts;
	}
	public void setTotalOutOfStockProducts(long totalOutOfStockProducts) {
		this.totalOutOfStockProducts = totalOutOfStockProducts;
	}
	public double getTotalOrderValues() {
		return totalOrderValues;
	}
	public void setTotalOrderValues(double totalOrderValues) {
		this.totalOrderValues = totalOrderValues;
	}
	public double getLastOrderValue() {
		return lastOrderValue;
	}
	public void setLastOrderValue(double lastOrderValue) {
		this.lastOrderValue = lastOrderValue;
	}
	public long getTotalReturns() {
		return totalReturns;
	}
	public void setTotalReturns(long totalReturns) {
		this.totalReturns = totalReturns;
	}
	public long getTotalOrdersCount() {
		return totalOrdersCount;
	}
	public void setTotalOrdersCount(long totalOrdersCount) {
		this.totalOrdersCount = totalOrdersCount;
	}
	public String getDateUpdated() {
		return dateUpdated;
	}
	public void setDateUpdated(String dateUpdated) {
		this.dateUpdated = dateUpdated;
	}
	
	
	
	
		
}