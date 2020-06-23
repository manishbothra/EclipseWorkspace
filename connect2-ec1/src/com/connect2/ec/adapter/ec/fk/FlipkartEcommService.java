package com.connect2.ec.adapter.ec.fk;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.connect2.ec.constants.ECType;
import com.connect2.ec.domain.C2IEcOrder;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.ec.domain.C2IEcSeller;
import com.connect2.ec.domain.C2IEcShipment;
import com.connect2.ec.domain.C2IEcStore;
import com.connect2.ec.service.IEComService;

@Service
public class FlipkartEcommService extends FlipkartEcommBaseService implements IEComService {

	private final Logger logger = LoggerFactory.getLogger(FlipkartEcommBaseService.class);

	@Autowired
	private FlipkartProductService fkProductService;
	
	@Autowired
	private FlipkartOrderService fkOrderService;
	
	public ECType getECType() {
		return ECType.FLIPKART;
	}

	@Override
	public C2IEcStore getStoreDetails() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public C2IEcSeller getSellerInfo() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcProduct> getProducts(List<String> skus) {
		List<C2IEcProduct> products = fkProductService.getProducts(skus);
		return products;
	}

	@Override
	public String insertProduct(C2IEcProduct product) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public C2IEcProduct getProduct(C2IEcProduct criteria) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String updateProduct(C2IEcProduct product) {
		return fkProductService.updateProduct(product);
	}

	@Override
	public boolean updateProductPrice(C2IEcProduct product) {
		return fkProductService.updateProductPrice(product);
	}

	@Override
	public boolean updateProductInventory(C2IEcProduct product) {
		return fkProductService.updateProductInventory(product);
	}

	@Override
	public List<C2IEcOrder> getAllOrders() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcOrder> getOrders(Date startDate, Date endDate) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String,Object> getOrderDetails(C2IEcOrder criteria) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> searchShipment(List<C2IEcShipment> shipments) {
		return fkOrderService.searchShipment(shipments);
	}

	@Override
	public List<C2IEcShipment> generateLabel(List<C2IEcShipment> shipments) {
		return fkOrderService.generateLabel(shipments);	
	}

	@Override
	public List<C2IEcShipment> markReadyToDispatch(List<C2IEcShipment> shipments) {
		return fkOrderService.markReadyToDispatch(shipments);	
	}

	@Override
	public List<C2IEcShipment> cancelOrder(List<C2IEcShipment> shipments) {
		return fkOrderService.cancelOrder(shipments);	
	}

	@Override
	public List<C2IEcShipment> markDelivered(List<C2IEcShipment> shipments) {
		return fkOrderService.markDelivered(shipments);	
	}

	@Override
	public List<C2IEcShipment> markAttemptedDelivery(List<C2IEcShipment> shipments) {
		return fkOrderService.markAttemptedDelivery(shipments);	
	}

	@Override
	public List<C2IEcShipment> markServiceCompleted(List<C2IEcShipment> shipments) {
		return fkOrderService.markServiceCompleted(shipments);	
	}

	@Override
	public List<C2IEcShipment> markServiceAttempted(List<C2IEcShipment> shipments) {
		return fkOrderService.markServiceAttempted(shipments);	
	}

	@Override
	public List<C2IEcShipment> approveReturns(List<C2IEcShipment> shipments) {
		return fkOrderService.approveReturns(shipments);	
	}

	@Override
	public List<C2IEcShipment> rejectReturns(List<C2IEcShipment> shipments) {
		return fkOrderService.rejectReturns(shipments);	
	}

	@Override
	public List<C2IEcShipment> completeReturns(List<C2IEcShipment> shipments) {
		return fkOrderService.completeReturns(shipments);	
	}

	@Override
	public List<C2IEcShipment> pickupReturns(List<C2IEcShipment> shipments) {
		return fkOrderService.pickupReturns(shipments);	
	}

	@Override
	public List<C2IEcShipment> pickupReturnsAttempted(List<C2IEcShipment> shipments) {
		return fkOrderService.pickupReturnsAttempted(shipments);	
	}

	
}
