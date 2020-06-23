package com.connect2.ec.adapter.ec.fk;

import java.util.ArrayList;
import java.util.List;

import com.connect2.ec.domain.C2IEcShipment;

public class FKShipment {

	private String shipmentId;
	
	private List<FKInvoice> invoices = new ArrayList<FKInvoice>();
	
	private String deliveryDate;
	
	public FKShipment() {
	}

	public FKShipment(C2IEcShipment shipment) {

	}

	public String getShipmentId() {
		return shipmentId;
	}

	public void setShipmentId(String shipmentId) {
		this.shipmentId = shipmentId;
	}

	public List<FKInvoice> getInvoices() {
		return invoices;
	}

	public void setInvoices(List<FKInvoice> invoices) {
		this.invoices = invoices;
	}

	public String getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(String deliveryDate) {
		this.deliveryDate = deliveryDate;
	}
	
	

	
}
