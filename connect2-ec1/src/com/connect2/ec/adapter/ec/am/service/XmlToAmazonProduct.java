package com.connect2.ec.adapter.ec.am.service;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;

public class XmlToAmazonProduct {
	public static List<AmazonProduct> saveProduct(String product) {
		List<AmazonProduct> amazonProductList=new ArrayList<AmazonProduct>();
		AmazonProduct amazonProduct=new AmazonProduct();
		
		Document doc = convertStringToXMLDocument( product );
		Node root=doc.getFirstChild();
		System.out.println(root);
		NodeList rootChildren=root.getChildNodes(),result=null,errorList=null,productList=null;
		
		System.out.println(rootChildren.getLength());
		for(int i=0;i<rootChildren.getLength();i++) {
			if(rootChildren.item(i).getNodeName().equals("GetMatchingProductForIdResult")) {
//				System.out.println("hiiiii");
				int flag=0;
				result=rootChildren.item(i).getChildNodes();
				
				for(int j=0;j<result.getLength();j++) {
//					System.out.println(result.item(i).getNodeName());
					if(result.item(j).getNodeName().equals("Error")) {
						amazonProduct.setProduct_id("-1");
						errorList=result.item(j).getChildNodes();
						flag=2;
					}
					if(result.item(j).getNodeName().equals("Products")) {
						productList=result.item(j).getChildNodes();
						flag=1;
					}
					if(result.item(j).getNodeName().equals("_Id")) {
						amazonProduct.setSku(result.item(j).getNodeValue());
					}
				}

				if(flag==0) {
					AmazonProduct tempProduct=new AmazonProduct();
					for(int j=0;j<result.getLength();j++) {
						if(result.item(j).getNodeName().equals("Error")) {
							amazonProduct.setProduct_id("-1");
							errorList=result.item(j).getChildNodes();
							tempProduct=getProductError(errorList);
						}
						if(result.item(j).getNodeName().equals("Products")) {
							productList=result.item(j).getChildNodes();
							tempProduct=getProductInfo(productList);
						}
						if(result.item(j).getNodeName().equals("_Id")) {
							tempProduct.setSku(result.item(j).getNodeValue());
						}
						amazonProductList.add(tempProduct);
					}
				}
				else if(flag==1) {
					amazonProduct=getProductInfo(productList);
					amazonProductList.add(amazonProduct);
				}
				else if(flag==2) {
					amazonProduct=getProductError(errorList);
					amazonProductList.add(amazonProduct);		
				}
			}
		}
		
		

		return amazonProductList;
	}
	
	private static AmazonProduct getProductError(NodeList errorList) {
		AmazonProduct amazonProduct=new AmazonProduct();
		
		for(int i=0;i<errorList.getLength();i++) {
			if(errorList.item(i).getNodeName().equals("Message")) {
//				System.out.println(errorList.item(i).getNodeName());
				amazonProduct.setDescription(errorList.item(i).getTextContent());
			}
		}
		return amazonProduct;
	}
	
	
	private static AmazonProduct getProductInfo(NodeList productList) {
		

		NodeList attributeList=null,itemAttributes=null;
		AmazonProduct amazonProduct=new AmazonProduct();
		
		for(int i=0;i<productList.getLength();i++) {
			if(productList.item(i).getNodeName().contains("Product")) {
				productList=productList.item(i).getChildNodes();
			}
		}
		for(int i=0;i<productList.getLength();i++) {
			if(productList.item(i).getNodeName().contains("AttributeSets")) {
				attributeList=productList.item(i).getChildNodes();
			}
		}
		for(int i=0;i<attributeList.getLength();i++) {
			if((attributeList.item(i).getNodeName()).contains("ItemAttributes")) {
				itemAttributes=attributeList.item(i).getChildNodes();
			}
		}
		for(int i=0;i<itemAttributes.getLength();i++) {
//			System.out.println(itemAttributes.item(i).getNodeName());
//			System.out.println(itemAttributes.item(i).getTextContent());
			String value=itemAttributes.item(i).getTextContent();
			value=removens2(value);
//			System.out.println(value);
			if(itemAttributes.item(i).getNodeName().contains("Binding")) {
				
			}
			if(itemAttributes.item(i).getNodeName().contains("Brand")) {
				amazonProduct.setBrand(value);
			}
			if(itemAttributes.item(i).getNodeName().contains("Color")) {
				amazonProduct.setBrand_color(value);
			}
			if(itemAttributes.item(i).getNodeName().contains("Department")) {
				
			}
			if(itemAttributes.item(i).getNodeName().contains("Label")) {
				
			}
			if(itemAttributes.item(i).getNodeName().contains("ListPrice")) {
//				amazonProduct.setMrp(Double.parseDouble(value));
			}
			if(itemAttributes.item(i).getNodeName().contains("Manufacturer")) {
				amazonProduct.setManufacturer_details(value);
			}
			if(itemAttributes.item(i).getNodeName().contains("PackageDimensions")) {
//				NodeList dimensions=itemAttributes.item(i).getChildNodes();
				String height=value.substring(0, 12),length=value.substring(12,24),breadth=value.substring(24, 36),weight=value.substring(36);
//				System.out.println(length);
//				System.out.println(breadth);
//				System.out.println(height);
//				System.out.println(weight);
				try {
					amazonProduct.setPackage_height(Double.parseDouble(height));
					amazonProduct.setPackage_breadth(Double.parseDouble(breadth));
					amazonProduct.setPackage_length(Double.parseDouble(length));
					amazonProduct.setPackage_weight(Double.parseDouble(weight));
				}
				catch(Exception e) {
					e.printStackTrace();
				}
			}
			if(itemAttributes.item(i).getNodeName().contains("PackageQuantity")) {
				amazonProduct.setNo_of_items(Integer.parseInt(value));
			}
			if(itemAttributes.item(i).getNodeName().contains("ProductTypeName")) {
				
			}
			if(itemAttributes.item(i).getNodeName().contains("Size")) {
				amazonProduct.setSize(value);
			}
			if(itemAttributes.item(i).getNodeName().contains("SmallImage")) {
				amazonProduct.setMain_img(value);
			}
			if(itemAttributes.item(i).getNodeName().contains("Title")) {
				amazonProduct.setProduct_name(value);
			}
			if(itemAttributes.item(i).getNodeName().contains("ProductGroup")) {
				amazonProduct.setCategory(value);
			}
			
		}
		return amazonProduct;
	}
	
	public static List<AmazonProduct> getInventory(String product) {
		AmazonProduct amazonProduct=new AmazonProduct();
		List<AmazonProduct> amazonProductList=new ArrayList<AmazonProduct>();
		
		Document doc = convertStringToXMLDocument( product );
		Node root=doc.getFirstChild();
		System.out.println(root);
		NodeList result=root.getChildNodes(),supplyRes=null;
		
		for(int i=0;i<result.getLength();i++) {
			if(result.item(i).getNodeName().equals("ListInventorySupplyResult")) {
				result=result.item(i).getChildNodes();
				break;
			}
		}
		for (int i=0;i<result.getLength();i++) {
			System.out.println(result.item(i).getNodeName());
			if(result.item(i).getNodeName().equals("InventorySupplyList")) {
				supplyRes=result.item(i).getChildNodes();
			}
		}
		for(int i=0;i<supplyRes.getLength();i++) {
			if(supplyRes.item(i).getNodeName().equals("member")) {
				AmazonProduct temp=getProductInventory(supplyRes.item(i));
				amazonProductList.add(temp);
			}
		}
		
		return amazonProductList;
	}
	
	public List<AmazonProduct> getPrice(String product) {
		AmazonProduct amazonProduct=new AmazonProduct();
		List<AmazonProduct> amazonProductList=new ArrayList<AmazonProduct>();
		
		Document doc = convertStringToXMLDocument( product );
		Node root=doc.getFirstChild();
		System.out.println(root);
		
		NodeList result=root.getChildNodes(),productList=null;
		for(int i=0;i<result.getLength();i++) {
			if(result.item(i).getNodeName().equals("GetMyPriceForSKUResult")) {
				String sku=result.item(i).getAttributes().getNamedItem("SellerSKU").getTextContent();
//				System.out.println(sku);
				NodeList temp=result.item(i).getChildNodes();
				for(int j=0;j<temp.getLength();j++) {
//					System.out.println(temp.item(j).getNodeName());
					if(temp.item(j).getNodeName().equals("Product")) {
						AmazonProduct temp2=getProductPrice(temp);
						temp2.setSku(sku);
						amazonProductList.add(temp2);
					}
					if(temp.item(j).getNodeName().equals("Error")) {
						AmazonProduct temp2=getProductPriceError(temp);
						temp2.setSku(sku);
						amazonProductList.add(temp2);
					}
				}
			}
		}
		
		return amazonProductList;
	}
	
	private AmazonProduct getProductPriceError(NodeList item) {
		AmazonProduct amazonProduct=new AmazonProduct();
		NodeList root=item,errorList=null;
//		errorList=root;
		for(int i=0;i<root.getLength();i++) {
//			System.out.println(root.item(i).getNodeName());
			if(root.item(i).getNodeName().equals("Error")) {
				 errorList=root.item(i).getChildNodes();
			}
//			if(root.item(i).getNodeName().equals("_SellerSKU")) {
//				 amazonProduct.setSku(root.item(i).getTextContent());
//			}
		}
		for(int i=0;i<errorList.getLength();i++) {
//			System.out.println(errorList.item(i).getNodeName());
			if(errorList.item(i).getNodeName().equals("Message")) {
				 amazonProduct.setProduct_id(errorList.item(i).getTextContent());
			}
			
		}
		return amazonProduct;
	}

	private AmazonProduct getProductPrice(NodeList item) {
		AmazonProduct amazonProduct=new AmazonProduct();
		NodeList root=null,offers=null;
		for(int i=0;i<item.getLength();i++) {
			if(item.item(i).getNodeName().equals("Product")) {
				root=item.item(i).getChildNodes();
			}
		}
		
		for(int i=0;i<root.getLength();i++) {
//			System.out.println(root.item(i).getNodeName());
			if(root.item(i).getNodeName().equals("Offers")) {
				//SET PRICE
			}
		}
		return amazonProduct;
	}

	private static AmazonProduct getProductInventory(Node item) {
		AmazonProduct amazonProduct=new AmazonProduct();
		NodeList root=item.getChildNodes();
		for(int i=0;i<root.getLength();i++) {
			if(root.item(i).getNodeName().equals("InStockSupplyQuantity")) {
				amazonProduct.setStock(Integer.parseInt(root.item(i).getTextContent()));
			}
			if(root.item(i).getNodeName().equals("SellerSKU")) {
				amazonProduct.setSku(root.item(i).getTextContent());;
			}
		}
		return amazonProduct;
	}
	
	public static HashMap<Object,Object> getOrderDetails(String orderXml){
		HashMap<Object,Object> result=new HashMap<Object,Object>();
		String url="C:/Users/Shashank/git/c2i-ec/connect2-ec/src/main/java/com/connect2/ec/adapter/ec/am/xml/GetOrderSample.xml";
		int count=0;
		DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docBuilder;
		Document doc =null;
		try {
			docBuilder = docFactory.newDocumentBuilder();
			doc= docBuilder.parse(url);
		} catch (ParserConfigurationException | SAXException | IOException e) {
			e.printStackTrace();
		}	
		Node root = doc.getFirstChild();
		NodeList rootChildren=root.getChildNodes(),orders=null,orderRes=null;
		for(int i=0;i<rootChildren.getLength();i++) {
			if(rootChildren.item(i).getNodeName().equals("ListOrdersResult") || rootChildren.item(i).getNodeName().equals("GetOrderResult")) {
				orderRes=rootChildren.item(i).getChildNodes();
			}
		}
		for(int i=0;i<orderRes.getLength();i++) {
			if(orderRes.item(i).getNodeName().equals("Orders")) {
				orders=orderRes.item(i).getChildNodes();
			}
		}
		for(int i=0;i<orders.getLength();i++) {
			HashMap<Object,Object>temp=new HashMap<Object,Object>();
			if(orders.item(i).getNodeName().equals("Order")) {
				temp=getOrder(orders.item(i).getChildNodes(),temp);
				count++;
				result.put(count, temp);
			}
		}
		
//		for (Object key : result.values()) {
//			System.out.println(key);
//		}
//		System.out.println(result.size());
		return result;
	}

	private static HashMap<Object,Object> getOrder(NodeList order,HashMap<Object,Object> orderMap) {
		for(int i=0;i<order.getLength();i++) {
			if(order.item(i).getNodeType() == Node.ELEMENT_NODE) {
				orderMap.put(order.item(i).getNodeName(), order.item(i).getTextContent());
			}
		}
		return orderMap;
	}

	private static String removens2(String value) {
		if(value.contains("ns2:")) {
			value.replace("ns2:", "");
		}
		return value;
	}

	private static Document convertStringToXMLDocument(String xmlString) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
         
        DocumentBuilder builder = null;
        try
        {
            builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlString)));
            return doc;
        } 
        catch (Exception e) 
        {
            e.printStackTrace();
        }
        return null;
    }
	
	public static void main(String args[]) {
		getOrderDetails(null);
	}

	
}
