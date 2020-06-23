package com.connect2.ec.adapter.ec.eb.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
public class EbayEcomService extends EbayEcomBaseService implements IEComService {

	@Autowired 
	private EbayProductService eps;
	
	@Autowired
	private EbayOrderService eos;
	
	@Override
	public ECType getECType() {
		// TODO Auto-generated method stub
		return null;
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
//		return eps.getProducts(skus);
		List<C2IEcProduct> list= new ArrayList<C2IEcProduct>();
		return list;
		
	}

	@Override
	public C2IEcProduct getProduct(C2IEcProduct criteria) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String insertProduct(C2IEcProduct product) {
		//return eps.insertProduct(product);
		return null;
	}

	@Override
	public String updateProduct(C2IEcProduct product) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean updateProductPrice(C2IEcProduct product) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean updateProductInventory(C2IEcProduct product) {
//		return eps.updateInventory(product);
		return false;
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
		return eos.getOrder(criteria);
	}

	@Override
	public List<C2IEcShipment> searchShipment(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> generateLabel(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> markReadyToDispatch(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> cancelOrder(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> markDelivered(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> markAttemptedDelivery(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> markServiceCompleted(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> markServiceAttempted(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> approveReturns(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> rejectReturns(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> completeReturns(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> pickupReturns(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<C2IEcShipment> pickupReturnsAttempted(List<C2IEcShipment> shipments) {
		// TODO Auto-generated method stub
		return null;
	}

}
