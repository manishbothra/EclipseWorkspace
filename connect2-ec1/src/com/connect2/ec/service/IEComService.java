package com.connect2.ec.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.connect2.ec.constants.ECType;
import com.connect2.ec.domain.C2IEcOrder;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.ec.domain.C2IEcShipment;
import com.connect2.ec.domain.C2IEcStore;

@Service
public interface IEComService {
	
	public ECType getECType();

	public C2IEcStore getStoreDetails();

	public C2IEcSeller getSellerInfo();

	public List<C2IEcProduct> getProducts(List<String> skus);

	public C2IEcProduct getProduct(C2IEcProduct criteria);

	public String insertProduct(C2IEcProduct product);

	public String updateProduct(C2IEcProduct product);

	public boolean updateProductPrice(C2IEcProduct product);

	public boolean updateProductInventory(C2IEcProduct product);

	public List<C2IEcOrder> getAllOrders();

	public List<C2IEcOrder> getOrders(Date startDate, Date endDate);

	public Map<String,Object> getOrderDetails(C2IEcOrder criteria);

	public List<C2IEcShipment> searchShipment(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> generateLabel(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> markReadyToDispatch(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> cancelOrder(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> markDelivered(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> markAttemptedDelivery(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> markServiceCompleted(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> markServiceAttempted(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> approveReturns(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> rejectReturns(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> completeReturns(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> pickupReturns(List<C2IEcShipment> shipments);

	public List<C2IEcShipment> pickupReturnsAttempted(List<C2IEcShipment> shipments);
}
