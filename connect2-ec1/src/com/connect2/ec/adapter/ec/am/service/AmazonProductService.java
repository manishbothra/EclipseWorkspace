package com.connect2.ec.adapter.ec.am.service;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.xml.datatype.DatatypeConfigurationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.connect2.ec.adapter.ec.am.GetFeedSubmissionCount;
import com.connect2.ec.adapter.ec.am.GetInventory;
import com.connect2.ec.adapter.ec.am.GetMyPriceForSku;
import com.connect2.ec.adapter.ec.am.GetProductById;
import com.connect2.ec.adapter.ec.am.GetReport;
import com.connect2.ec.adapter.ec.am.RequestReport;
import com.connect2.ec.adapter.ec.am.SubmitFeed;
import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;
import com.connect2.ec.adapter.ec.am.bean.CredentialsBean;
import com.connect2.ec.domain.C2IEcProdSellingInfo;
import com.connect2.ec.domain.C2IEcProduct;
import com.connect2.ec.domain.C2IEcSeller;

@Service
public class AmazonProductService extends AmazonEcomBaseService {

	
	@Autowired 
	private XmlEditor xmlEditor;
	
	private static final String sellerDevAuthToken = "amzn.mws.1eb895ad-3806-d030-fd62-a3738db233ae";
	private static final String merchantId = "A1ZRT2O38J6EA0";//"A2OAR5JAACGI4Z";
	
	public static void main(String args[]) {
		
		List<String> sku=new ArrayList<String>();
		C2IEcSeller c2iSeller=new C2IEcSeller();
		C2IEcProduct c2iProduct=new C2IEcProduct();
		C2IEcProdSellingInfo c2iSellingInfo=new C2IEcProdSellingInfo();
		c2iProduct.setProductId("B00R606EWU");
		c2iProduct.setSku("2234567890");
		c2iSellingInfo.setMrp(800);
		c2iSellingInfo.setSellingPrice(799);
		c2iProduct.setStock(4);
		c2iProduct.setManufacturerDetails("VIDYA STEELS");
		c2iProduct.setSellingInfo(c2iSellingInfo);
		c2iProduct.setTaxCode("A_GEN_NOTAX");
		c2iProduct.setProductName("Vidya Steels Rbj Stainless Steel Tableware Drinkware Tumbler Drinking Glasses Set Of 6 Mirror Finish");
		c2iProduct.setBrand("VIDYA STEELS");
		c2iProduct.setProductIdType("ASIN");
		
		Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        System.out.println(timestamp);
		
		
		sku.add("KC-1ASP-3U23");
		
        sku.add("11111");
        
        sku.add("7I-F7UU-AMCG");
        
        List<String>images=new ArrayList<String>();
        images.add("https://static.connect2india.com/c2icd/company_resources/3279559/images/products/product-industrial-shed-maintenance.jpg");
        images.add("https://static.connect2india.com/c2icd/company_resources/1000090/images/products/product-drawing-and-designing-service.jpg");
        images.add("https://static.connect2india.com/c2icd/company_resources/1053227/images/products/product-hms1-scrap.jpg");
        
        
//        getReport(c2iSeller);
//		getProducts(sku,c2iSeller);				//DONE
//		insertProduct(c2iProduct,c2iSeller);	//DONE
//		updateInventory(c2iProduct,c2iSeller);	//DONE						
//		getInventory(sku,c2iSeller);			//DONE
//		getFeedSubmissionCount();				//NOT NEEDED
//		getMyPriceForSku(sku,c2iSeller);		//PRICE NOT PRESENT IN XML
//		updatePrice(c2iProduct,c2iSeller);		//DONE
//		deleteProduct(c2iProduct,c2iSeller);	//DONE
//		updateProduct(c2iProduct,c2iSeller);	//DONE
//		updateImage(images,c2iProduct,c2iSeller);//DONE
	}
	
	public static boolean getReport(C2IEcSeller c2iSeller,String reportId) {
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		
//		reportId="20789515617018345";
		GetReport.getReport(credentials, reportId);
		return true;
		
	}
	
	public static boolean requestReport(C2IEcSeller c2iSeller,String reportType) {
//		String sellerDevAuthToken="amzn.mws.84b81f01-9bc9-b3a3-2883-b22dfc15b070";
//		String merchantId="A1ZRT2O38J6EA0";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		reportType="_GET_MERCHANT_LISTINGS_ALL_DATA_";
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
//		String reportId="20789515617018345";
		RequestReport.requestReport(credentials, reportType);
		return true;
		
	}
	
	public String insertProduct(C2IEcProduct c2iProduct,C2IEcSeller c2iSeller) {
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		AmazonProduct amazonProduct=makeProduct(c2iProduct);
		
		amazonProduct.setRecommended_browse_nodes("1318082031");
		amazonProduct.setTax_code("A_GEN_NOTAX");
		
		amazonProduct.setProduct_name(c2iProduct.getProductName());

		amazonProduct.setProduct_id_type("ASIN");
		
//		amazonProduct.setManufacturer_details("Hum hi hai");
//		amazonProduct.setProduct_id("B00R606EWU");
//		amazonProduct.setBrand("HELLO");
		
		String operation="Update";
		String url= xmlEditor.editInputXML(amazonProduct, merchantId, operation);
		System.out.println(url);
		String feedType="_POST_PRODUCT_DATA_";
//		String url="./src/main/java/com/connect2/ec/adapter/ec/am/xml/PostOrderAcknowledgement.xml";
		CredentialsBean credentials=getCredentials(feedType, markets,url,sellerDevAuthToken,merchantId);
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		try {
			result = SubmitFeed.submitProduct(credentials);
//			updateProduct(c2iProduct,c2iSeller);	
//			updateImage(images,c2iProduct,c2iSeller);
			updateInventory(c2iProduct,c2iSeller);
			updatePrice(c2iProduct,c2iSeller);
		} catch (NoSuchAlgorithmException | IOException e) {
			e.printStackTrace();
		}
		return result.get("result").toString();
	}
	
	public boolean updateInventory(C2IEcProduct c2iProduct,C2IEcSeller c2iSeller) {
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		AmazonProduct amazonProduct=makeProduct(c2iProduct);
		long inventory=amazonProduct.getStock();
		String url=xmlEditor.editUpdateInventoryXML(amazonProduct, inventory,merchantId);
		String feedType="_POST_INVENTORY_AVAILABILITY_DATA_";
		
		CredentialsBean credentials=getCredentials(feedType, markets,url,sellerDevAuthToken,merchantId);
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		try {
			result = SubmitFeed.submitProduct(credentials);
		} catch (NoSuchAlgorithmException | IOException e) {
			e.printStackTrace();
		}
		return (boolean)result.get("result");
	}
	
	public void updatePrice(C2IEcProduct c2iProduct,C2IEcSeller c2iSeller) {
		String feedType="_POST_PRODUCT_PRICING_DATA_";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		AmazonProduct amazonProduct=makeProduct(c2iProduct);
		
		amazonProduct.setProduct_id_type("ASIN");
		
		String url=xmlEditor.editUpdatePriceXML(amazonProduct,merchantId);
		CredentialsBean credentials=getCredentials(feedType, markets,url,sellerDevAuthToken,merchantId);
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		try {
			result = SubmitFeed.submitProduct(credentials);
		} catch (NoSuchAlgorithmException | IOException e) {
			e.printStackTrace();
		}
	}
	
	//TO DO
	public void updateImage(List<String>images,C2IEcProduct c2iProduct,C2IEcSeller c2iSeller) {
		AmazonProduct amazonProduct=makeProduct(c2iProduct);
		for(int i=0;i<images.size();i++) {
			String imageTypeString="";
			if(i==0) {
				imageTypeString="Main";
			}
			else if(i<9) {
				imageTypeString="PT"+i;
			}
			else if(i==9) {
				break;
			}
			String url= xmlEditor.editUpdateImageXML(images.get(i), merchantId, amazonProduct, imageTypeString);
			String feedType="_POST_PRODUCT_IMAGE_DATA_";
			
			List<String> markets=new ArrayList<String>();
			markets.add("A21TJRUUN4KGV");
			
			CredentialsBean credentials=getCredentials(feedType, markets,url,sellerDevAuthToken,merchantId);
			HashMap<Object,Object> result=new HashMap<Object,Object>();
			try {
				result = SubmitFeed.submitProduct(credentials);
			} catch (NoSuchAlgorithmException | IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public boolean updateProduct(C2IEcProduct c2iProduct,C2IEcSeller c2iSeller) {
		boolean res=false;
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		AmazonProduct amazonProduct=makeProduct(c2iProduct);
		amazonProduct.setRecommended_browse_nodes("1318082031");
		amazonProduct.setProduct_id_type("ASIN");
		amazonProduct.setManufacturer_details("ABHI BHI HUM HI HAI");
		
		String operation="PartialUpdate";
		String url = xmlEditor.editInputXML(amazonProduct,merchantId,operation);
		String feedType="_POST_PRODUCT_DATA_";
		
		
		CredentialsBean credentials=getCredentials(feedType, markets,url,sellerDevAuthToken,merchantId);
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		res=true;
		try {
			result = SubmitFeed.submitProduct(credentials);
			updateInventory(c2iProduct,c2iSeller);
			updatePrice(c2iProduct,c2iSeller);
			
		} catch (NoSuchAlgorithmException | IOException e) {
			e.printStackTrace();
		}
		return res;
	}
	
	public List<C2IEcProduct> getProducts(List<String> skus,C2IEcSeller c2iSeller) {
		List<C2IEcProduct>c2iProducts=new ArrayList<C2IEcProduct>();
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		
		AmazonProduct amazonProduct = new AmazonProduct();
		GetProductById getProductById=new GetProductById();
		List<AmazonProduct>amazonProductList=GetProductById.getProduct(credentials,skus);
		List<AmazonProduct>amazonProductPriceList=getMyPriceForSku(skus, c2iSeller);
		List<AmazonProduct>amazonProductInvList=getInventory(skus, c2iSeller);
		List<C2IEcProduct>c2iProductList=new ArrayList<C2IEcProduct>();
		
		for(int i=0;i<amazonProductList.size();i++) {
			AmazonProduct temp=amazonProductList.get(i);
			String sku=temp.getSku();
			for(int j=0;j<amazonProductPriceList.size();j++) {
				AmazonProduct temp2=amazonProductPriceList.get(j);
				if(temp2.getSku().equals(sku)) {
					amazonProductList.get(i).setSelling_price(temp2.getSelling_price());
					amazonProductList.get(i).setMrp(temp2.getMrp());
				}
			}
		}
		for(int i=0;i<amazonProductList.size();i++) {
			AmazonProduct temp=amazonProductList.get(i);
			String sku=temp.getSku();
			for(int j=0;j<amazonProductInvList.size();j++) {
				AmazonProduct temp2=amazonProductInvList.get(j);
				if(temp2.getSku().equals(sku)) {
					amazonProductList.get(i).setStock(temp2.getStock());
				}
			}
		}
		
		for(int i=0;i<amazonProductList.size();i++) {
			C2IEcProduct c2iProduct=new C2IEcProduct();
			c2iProduct=makeC2IProduct(amazonProductList.get(i));
			c2iProductList.add(c2iProduct);
		}
		
		return c2iProductList;
	}

	public List<AmazonProduct> getInventory(List<String> skus,C2IEcSeller c2iSeller) {
		
		String response="";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		List<AmazonProduct>amazonProductList=new ArrayList<AmazonProduct>();
		try {
			amazonProductList = GetInventory.getInventory(credentials,skus);
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
		}
		return amazonProductList;
	}
	
	public static List<AmazonProduct> getMyPriceForSku(List<String> skus,C2IEcSeller c2iSeller) {
		String feedType="_POST_PRODUCT_PRICING_DATA_";
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(feedType, markets,null,sellerDevAuthToken,merchantId);
		List<AmazonProduct>amazonProductList = GetMyPriceForSku.getMyPriceForSku(credentials,skus);
		return amazonProductList;
	}
	
	public void deleteProduct(C2IEcProduct c2iProduct,C2IEcSeller c2iSeller) {
		AmazonProduct amazonProduct=makeProduct(c2iProduct);
		
		amazonProduct.setProduct_id_type("ASIN");
		
		String url= xmlEditor.editDeleteProductXML(amazonProduct);
		String feedType="_POST_PRODUCT_DATA_";
		List<String> markets=new ArrayList<String>();
		
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(feedType, markets,url,sellerDevAuthToken,merchantId);
		SubmitFeed submitFeed=new SubmitFeed();
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		try {
			result = SubmitFeed.submitProduct(credentials);
		} catch (NoSuchAlgorithmException | IOException e) {
			e.printStackTrace();
		}
	}
	
	private static String getFeedSubmissionCount() {
		
		List<String> markets=new ArrayList<String>();
		markets.add("A21TJRUUN4KGV");
		
		CredentialsBean credentials=getCredentials(null, markets,null,sellerDevAuthToken,merchantId);
		
		String res=GetFeedSubmissionCount.getFeedSubmissionCount(credentials);
		return res;
	}	
}
