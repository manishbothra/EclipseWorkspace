package com.connect2.ec.adapter.ec.am.service;

import java.util.Date;
import java.util.HashMap;
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
public class AmazonEcomService extends AmazonEcomBaseService implements IEComService {

	private final Logger logger = LoggerFactory.getLogger(AmazonEcomService.class);

	@Autowired
	private AmazonProductService amazonProductService;
	
	public ECType getECType() {
		return ECType.AMAZON;
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
	//Add parameter - c2iSeller
	public List<C2IEcProduct> getProducts(List<String> skus) {
		C2IEcSeller c2iSeller=new C2IEcSeller();
		return amazonProductService.getProducts(skus,c2iSeller);
	}

	@Override
	public C2IEcProduct getProduct(C2IEcProduct criteria) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String insertProduct(C2IEcProduct product) {
		//GET C2I SELLER
		C2IEcSeller c2iSeller=new C2IEcSeller();
		return amazonProductService.insertProduct(product,c2iSeller);
	}

	@Override
	public String updateProduct(C2IEcProduct product) {
		C2IEcSeller c2iSeller=new C2IEcSeller();
		boolean res=amazonProductService.updateProduct(product,c2iSeller);
		return "false";
	}

	@Override
	public boolean updateProductPrice(C2IEcProduct product) {
		C2IEcSeller c2iSeller=new C2IEcSeller();
		amazonProductService.updatePrice(product, c2iSeller);
		return false;
	}

	@Override
	//Add parameter - C2ISeller
	public boolean updateProductInventory(C2IEcProduct product) {
		C2IEcSeller c2iSeller=new C2IEcSeller();
		return amazonProductService.updateInventory(product,c2iSeller);
	}

	@Override
	public List<C2IEcOrder> getAllOrders() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	//Return hashmap
	public List<C2IEcOrder> getOrders(Date startDate, Date endDate) {
		HashMap<Object,Object> result= AmazonOrderService.getOrderDetailsByDate(startDate, endDate);
		return null;
	}

	@Override
	//Add parameter- List of Order IDS and return hashmap
	public Map<String,Object> getOrderDetails(C2IEcOrder criteria) {
		List<String> orderId=null;
		HashMap<Object,Object> result = AmazonOrderService.getOrderDetails(orderId);
		return null;
	}

	@Override
	public List<C2IEcShipment> searchShipment(List<C2IEcShipment> shipments) {
		return shipments;
	}

	@Override
	public List<C2IEcShipment> generateLabel(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> markReadyToDispatch(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> cancelOrder(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> markDelivered(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> markAttemptedDelivery(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> markServiceCompleted(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> markServiceAttempted(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> approveReturns(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> rejectReturns(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> completeReturns(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> pickupReturns(List<C2IEcShipment> shipments) {
		return shipments;

	}

	@Override
	public List<C2IEcShipment> pickupReturnsAttempted(List<C2IEcShipment> shipments) {
		return shipments;

	}

}
