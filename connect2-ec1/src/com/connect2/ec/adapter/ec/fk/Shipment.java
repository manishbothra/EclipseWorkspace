package com.connect2.ec.adapter.ec.fk;

import java.util.ArrayList;
import java.util.List;

public class Shipment {

	private String status;
	private String shipmentId;
	private String locationId;
	private String deliveryDate;
	
	//Cancelled Shipment
	private String reason;
	private List<String> cancellationOrderIds = new ArrayList<String>();
	
	//Attempted Delivery
	private String failureSubReason;
	private String failureReason;
	private String newDeliveryDate;
	
	//Service
	private String serviceFulfilmentId;
	private String serviceDeliveryDate;
	
	//Attempted Service
	private String svFailureSubReason;
	private String svFailureReason;
	private String svnewDeliveryDate;
	private String svComments;
	
	//returns
	private String returnsComments;
	private String returnsServiceDate;
	private String returnId;
	private String returnServiceFulfilmentId;
	private String pickupDate;
	private String pickupReturnsFailureReason;
	private String newPickupDate;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getShipmentId() {
		return shipmentId;
	}

	public void setShipmentId(String shipmentId) {
		this.shipmentId = shipmentId;
	}

	public String getLocationId() {
		return locationId;
	}

	public void setLocationId(String locationId) {
		this.locationId = locationId;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public List<String> getCancellationOrderIds() {
		return cancellationOrderIds;
	}

	public void setCancellationOrderIds(List<String> cancellationOrderIds) {
		this.cancellationOrderIds = cancellationOrderIds;
	}

	public String getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(String deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public String getFailureSubReason() {
		return failureSubReason;
	}

	public void setFailureSubReason(String failureSubReason) {
		this.failureSubReason = failureSubReason;
	}

	public String getFailureReason() {
		return failureReason;
	}

	public void setFailureReason(String failureReason) {
		this.failureReason = failureReason;
	}

	public String getNewDeliveryDate() {
		return newDeliveryDate;
	}

	public void setNewDeliveryDate(String newDeliveryDate) {
		this.newDeliveryDate = newDeliveryDate;
	}

	public String getServiceFulfilmentId() {
		return serviceFulfilmentId;
	}

	public void setServiceFulfilmentId(String serviceFulfilmentId) {
		this.serviceFulfilmentId = serviceFulfilmentId;
	}

	public String getServiceDeliveryDate() {
		return serviceDeliveryDate;
	}

	public void setServiceDeliveryDate(String serviceDeliveryDate) {
		this.serviceDeliveryDate = serviceDeliveryDate;
	}

	public String getSvFailureSubReason() {
		return svFailureSubReason;
	}

	public void setSvFailureSubReason(String svFailureSubReason) {
		this.svFailureSubReason = svFailureSubReason;
	}

	public String getSvFailureReason() {
		return svFailureReason;
	}

	public void setSvFailureReason(String svFailureReason) {
		this.svFailureReason = svFailureReason;
	}

	public String getSvnewDeliveryDate() {
		return svnewDeliveryDate;
	}

	public void setSvnewDeliveryDate(String svnewDeliveryDate) {
		this.svnewDeliveryDate = svnewDeliveryDate;
	}

	public String getSvComments() {
		return svComments;
	}

	public void setSvComments(String svComments) {
		this.svComments = svComments;
	}

	public String getReturnsComments() {
		return returnsComments;
	}

	public void setReturnsComments(String returnsComments) {
		this.returnsComments = returnsComments;
	}

	public String getReturnsServiceDate() {
		return returnsServiceDate;
	}

	public void setReturnsServiceDate(String returnsServiceDate) {
		this.returnsServiceDate = returnsServiceDate;
	}

	public String getReturnId() {
		return returnId;
	}

	public void setReturnId(String returnId) {
		this.returnId = returnId;
	}

	public String getReturnServiceFulfilmentId() {
		return returnServiceFulfilmentId;
	}

	public void setReturnServiceFulfilmentId(String returnServiceFulfilmentId) {
		this.returnServiceFulfilmentId = returnServiceFulfilmentId;
	}

	public String getPickupDate() {
		return pickupDate;
	}

	public void setPickupDate(String pickupDate) {
		this.pickupDate = pickupDate;
	}

	public String getPickupReturnsFailureReason() {
		return pickupReturnsFailureReason;
	}

	public void setPickupReturnsFailureReason(String pickupReturnsFailureReason) {
		this.pickupReturnsFailureReason = pickupReturnsFailureReason;
	}

	public String getNewPickupDate() {
		return newPickupDate;
	}

	public void setNewPickupDate(String newPickupDate) {
		this.newPickupDate = newPickupDate;
	}

 

	

}
