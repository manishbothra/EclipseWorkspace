package com.connect2.ec.adapter.ec.fk;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class FKInvoice {

	private String invoiceNumber;
	private String orderId;
	private String shipmentId;
	private Date invoiceDate;
	private double invoiceAmount;
	
	private List<Map<Object, Object>> orderItems = new ArrayList<Map<Object, Object>>();

	public String getInvoiceNumber() {
		return invoiceNumber;
	}

	public void setInvoiceNumber(String invoiceNumber) {
		this.invoiceNumber = invoiceNumber;
	}

	public Date getInvoiceDate() {
		return invoiceDate;
	}

	public void setInvoiceDate(Date invoiceDate) {
		this.invoiceDate = invoiceDate;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getShipmentId() {
		return shipmentId;
	}

	public void setShipmentId(String shipmentId) {
		this.shipmentId = shipmentId;
	}

	public double getInvoiceAmount() {
		return invoiceAmount;
	}

	public void setInvoiceAmount(double invoiceAmount) {
		this.invoiceAmount = invoiceAmount;
	}

	public List<Map<Object, Object>> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<Map<Object, Object>> orderItems) {
		this.orderItems = orderItems;
	}
	

}
