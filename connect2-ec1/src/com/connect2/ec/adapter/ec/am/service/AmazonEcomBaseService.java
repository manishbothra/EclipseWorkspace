package com.connect2.ec.adapter.ec.am.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;
import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.adapter.ec.am.model.IdList;
import com.connect2.ec.domain.C2IEcProdSellingInfo;
import com.connect2.ec.domain.C2IEcProduct;

@Service
public class AmazonEcomBaseService {

	protected static CredentialsBean getCredentials(String feedType, List<String> markets,String url,String sellerDevAuthToken,String merchantId) {
		CredentialsBean credentials = new CredentialsBean();
		
		/*Developer Credentials*/
		credentials.setAccessKeyId("AKIAIJMOKEPY4KCR727Q");
		credentials.setSecretAccessKey("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");
		
		//SET service URL according to marketplace
		credentials.setServiceURL("https://mws.amazonservices.in/");
		
		credentials.setMerchantId(merchantId);
		
		credentials.setSellerDevAuthToken(sellerDevAuthToken);
		
		credentials.setFeedType(feedType);


		IdList marketplaces = new IdList(markets);
		credentials.setMarketplaces(marketplaces);

		credentials.setInputFilePath(url);
		return credentials;
	}
	
	protected static AmazonProduct makeProduct(C2IEcProduct c2iProduct) {
//		C2IEcProductSpecs c2iProductSpecs=c2iProduct.getProductSpecifications();
//		C2IEcProdAdditionalDetails c2iEcProdAdditionalDetails=c2iProduct.getAdditionalDetails();
		C2IEcProdSellingInfo c2iEcProductSellingInfo = c2iProduct.getSellingInfo();
//		System.out.println(c2iEcProdAdditionalDetails.getOtherFeatures());
//		System.out.println();
		List<String> bulletPoints= new ArrayList<String>();
//		bulletPoints.add((c2iEcProdAdditionalDetails!=null && c2iEcProdAdditionalDetails.getOtherFeatures()!=null ) ? c2iEcProdAdditionalDetails.getOtherFeatures() : " ");
		AmazonProduct product=new AmazonProduct();
		
		//CREATE HASHMAP FOR C2IADDITIONALDETAILS AND C2IPRODUCTSPECS
		
		product.setBrand((c2iProduct.getBrand()!=null) ? c2iProduct.getBrand() : " ");
//		product.setBrand_color((c2iProductSpecs!=null && c2iProductSpecs.getBrandColor()!=null)?c2iProductSpecs.getBrandColor():" ");
		product.setBullet_points(bulletPoints);
//		product.setCondition();
//		product.setDescription((c2iProduct.getDescription()!=null)?c2iProduct.getDescription():" ");
		product.setEc_prod_id(c2iProduct.getEcProdId());
		product.setEc_store_id(c2iProduct.getEcStoreId());
//		product.setExpirationTypeProduct();
		product.setFullfilment_by((c2iEcProductSellingInfo != null && c2iEcProductSellingInfo.getFullfilmentBy()!=null)? c2iEcProductSellingInfo.getFullfilmentBy():" ");
//		product.setGtin((c2iEcProdAdditionalDetails!=null && c2iEcProdAdditionalDetails.getGtin()!=null )?c2iEcProdAdditionalDetails.getGtin():" ");
		product.setHsn((c2iProduct.getHsn()!=null)?c2iProduct.getHsn():" ");
//		product.setItem_pack_quantity();
//		product.setItem_type();
		product.setListing_status((c2iEcProductSellingInfo != null && c2iEcProductSellingInfo.getListingStatus()!=null)? c2iEcProductSellingInfo.getListingStatus():" ");
		product.setLocal_delivery_charge((c2iEcProductSellingInfo != null && (Double)c2iEcProductSellingInfo.getLocalDeliveryCharge()!=null)? c2iEcProductSellingInfo.getLocalDeliveryCharge():0);
//		product.setMain_img();															//TO DO
		product.setManufacturer_details((c2iProduct.getManufacturerDetails()!=null)?c2iProduct.getManufacturerDetails():" ");
//		product.setMaterial();
		product.setMrp((c2iEcProductSellingInfo != null && (Double)c2iEcProductSellingInfo.getMrp() != null) ? c2iEcProductSellingInfo.getMrp() : 0);
		product.setNational_delivery_charge((c2iEcProductSellingInfo != null && (Double)c2iEcProductSellingInfo.getNationalDeliveryCharge()!=null)?c2iEcProductSellingInfo.getNationalDeliveryCharge():0);
//		product.setNo_of_items();
//		product.setPackage_breadth((c2iProductSpecs!=null && (Double)c2iProductSpecs.getPackageBreadth()!=null)?c2iProductSpecs.getPackageBreadth():0);
//		product.setPackage_length((c2iProductSpecs!=null && (Double)c2iProductSpecs.getPackageLength()!=null)?c2iProductSpecs.getPackageLength():0);
//		product.setPackage_height((c2iProductSpecs!=null && (Double)c2iProductSpecs.getPackageHeight()!=null)?c2iProductSpecs.getPackageHeight():0);
//		product.setPart_no();
		product.setProcurement_sla((c2iEcProductSellingInfo != null && (Integer)c2iEcProductSellingInfo.getProcurementSla()!=null)?c2iEcProductSellingInfo.getProcurementSla():1);
		product.setProduct_id(c2iProduct.getProductId());								
		product.setProduct_id_type(c2iProduct.getProductIdType()!=null?c2iProduct.getProductIdType():" ");													//MANDATORY(ADD THIS TO C2IPRODUCT)
		product.setProduct_name(c2iProduct.getProductName());
//		product.setRecommended_browse_nodes();											//MANDATORY(FIGURE OUT)
//		product.setSearch_keywords((c2iEcProdAdditionalDetails!=null && c2iEcProdAdditionalDetails.getSearchKeywords()!=null)?c2iEcProdAdditionalDetails.getSearchKeywords():" ");
		product.setSelling_price((c2iEcProductSellingInfo != null && (Double)c2iEcProductSellingInfo.getSellingPrice() != null)? c2iEcProductSellingInfo.getSellingPrice() : 0);
		product.setShipping_provider((c2iEcProductSellingInfo != null && c2iEcProductSellingInfo.getShippingProvider()!=null)?c2iEcProductSellingInfo.getShippingProvider():" ");
		product.setSku(c2iProduct.getSku());
		product.setStock(c2iProduct.getStock());
		product.setTax_code(c2iProduct.getTaxCode());
		product.setZonal_delivery_charge((c2iEcProductSellingInfo != null && (Double) c2iEcProductSellingInfo.getZonalDeliveryCharge() != null )? c2iEcProductSellingInfo.getZonalDeliveryCharge() : 0);

		return product;
	}
	
	protected static C2IEcProduct makeC2IProduct(AmazonProduct amazonProduct) {
		C2IEcProduct c2iProduct=new C2IEcProduct();
//		C2IEcProdAdditionalDetails c2iAddDetails=new C2IEcProdAdditionalDetails();
		C2IEcProdSellingInfo c2iSellingInfo=new C2IEcProdSellingInfo();
//		C2IEcProductSpecs c2iProdSpecs= new C2IEcProductSpecs();
		
		if(amazonProduct!=null) {
			c2iProduct.setBrand(amazonProduct.getBrand());
//			c2iProduct.setCategory(amazonProduct.getCategory());
//			c2iProduct.setDescription();
			c2iProduct.setMainCategory(amazonProduct.getCategory());
			c2iProduct.setManufacturerDetails(amazonProduct.getManufacturer_details());
			c2iProduct.setProductName(amazonProduct.getProduct_name());
			c2iProduct.setSku(amazonProduct.getSku());
			c2iProduct.setStock(amazonProduct.getStock());
			
//			c2iAddDetails.setWeight(amazonProduct.getPackage_weight());
			
//			c2iProdSpecs.setBrandColor(amazonProduct.getBrand_color());
//			c2iProdSpecs.setExternalDepth();
//			c2iProdSpecs.setPackageBreadth(amazonProduct.getPackage_breadth());
//			c2iProdSpecs.setPackageHeight(amazonProduct.getPackage_height());
//			c2iProdSpecs.setPackageLength(amazonProduct.getPackage_length());
//			c2iProdSpecs.setPackageWeight(amazonProduct.getPackage_weight());
			
			//ADD SPECIFICATIONS AND ADDITIONAL DETAILS USING HASHMAP
			
			c2iSellingInfo.setSellingPrice(amazonProduct.getSelling_price());
			c2iSellingInfo.setMrp(amazonProduct.getMrp());
			
			
//			c2iProduct.setProductSpecifications(c2iProdSpecs);
//			c2iProduct.setAdditionalDetails(c2iAddDetails);
			c2iProduct.setSellingInfo(c2iSellingInfo);
		}
		return c2iProduct;
	}
}
