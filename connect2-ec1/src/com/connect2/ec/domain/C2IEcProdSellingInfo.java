package com.connect2.ec.domain;

public class C2IEcProdSellingInfo {

	private int ecProdSiId;
	private String listingStatus;
	private double mrp;
	private double sellingPrice;
	private String fullfilmentBy;
	private String procurementType;
	private int procurementSla;
	private String shippingProvider;
	private double localDeliveryCharge;
	private double zonalDeliveryCharge;
	private double nationalDeliveryCharge;

	public int getEcProdSiId() {
		return ecProdSiId;
	}

	public void setEcProdSiId(int ecProdSiId) {
		this.ecProdSiId = ecProdSiId;
	}
	
	public String getListingStatus() {
		return listingStatus;
	}

	public void setListingStatus(String listingStatus) {
		this.listingStatus = listingStatus;
	}

	public double getMrp() {
		return mrp;
	}

	public void setMrp(double mrp) {
		this.mrp = mrp;
	}

	public double getSellingPrice() {
		return sellingPrice;
	}

	public void setSellingPrice(double sellingPrice) {
		this.sellingPrice = sellingPrice;
	}

	public String getFullfilmentBy() {
		return fullfilmentBy;
	}

	public void setFullfilmentBy(String fullfilmentBy) {
		this.fullfilmentBy = fullfilmentBy;
	}

	public String getProcurementType() {
		return procurementType;
	}

	public void setProcurementType(String procurementType) {
		this.procurementType = procurementType;
	}

	public int getProcurementSla() {
		return procurementSla;
	}

	public void setProcurementSla(int procurementSla) {
		this.procurementSla = procurementSla;
	}

	public String getShippingProvider() {
		return shippingProvider;
	}

	public void setShippingProvider(String shippingProvider) {
		this.shippingProvider = shippingProvider;
	}

	public double getLocalDeliveryCharge() {
		return localDeliveryCharge;
	}

	public void setLocalDeliveryCharge(double localDeliveryCharge) {
		this.localDeliveryCharge = localDeliveryCharge;
	}

	public double getZonalDeliveryCharge() {
		return zonalDeliveryCharge;
	}

	public void setZonalDeliveryCharge(double zonalDeliveryCharge) {
		this.zonalDeliveryCharge = zonalDeliveryCharge;
	}

	public double getNationalDeliveryCharge() {
		return nationalDeliveryCharge;
	}

	public void setNationalDeliveryCharge(double nationalDeliveryCharge) {
		this.nationalDeliveryCharge = nationalDeliveryCharge;
	}

	

}
