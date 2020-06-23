package com.connect2.ec.adapter.ec.am.service;

import java.io.File;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.connect2.ec.adapter.ec.am.bean.AmazonProduct;

@Service
public class XmlEditor {
	
	public static final String pathUrl = getPath(); //C2IUtils.getC2IHome()

	public String editInputXML(AmazonProduct amazonProduct, String merchantId, String operation) {
		String url = pathUrl;
		try {
			if (operation.equals("Update")) {
				url += "/Input.xml";
			} else {
				url += "/UpdateProduct.xml";
			}
			System.out.println(url);
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(url);
			System.out.println(url);
			Node root = doc.getFirstChild();
			NodeList rootChildren = root.getChildNodes();
			Node message = null, sku = null, product = null, prodIdType = null, prodId = null, prodTaxCode = null,
					title = null, brand = null, desc = null, bulletPoint = null, manufacturer = null,
					searchTerms = null, recBrowseNode = null, merchId = null, operationType = null;
			NodeList productList = null, standardProdIdList = null, descData = null, headerList = null;

			for (int i = 0; i < rootChildren.getLength(); i++) {
				message = rootChildren.item(i);
				if (message.getNodeName().equals("Message")) {
					productList = message.getChildNodes();
				} else if (message.getNodeName().equals("Header")) {
					headerList = message.getChildNodes();
				}
			}
			for (int i = 0; i < productList.getLength(); i++) {
				product = productList.item(i);
				if (product.getNodeName().equals("OperationType")) {
					operationType = product;
				}
				if (product.getNodeName().equals("Product")) {
					productList = product.getChildNodes();
				}
			}
			for (int i = 0; i < headerList.getLength(); i++) {
				if (headerList.item(i).getNodeName().equals("MerchantIdentifier")) {
					merchId = headerList.item(i);
				}
			}
			for (int i = 0; i < productList.getLength(); i++) {
				Node temp = productList.item(i);
				if (temp.getNodeName().equals("SKU")) {
					sku = temp;
				} else if (temp.getNodeName().equals("StandardProductID")) {
					standardProdIdList = temp.getChildNodes();
				} else if (temp.getNodeName().equals("ProductTaxCode")) {
					prodTaxCode = temp;
				} else if (temp.getNodeName().equals("DescriptionData")) {
					descData = temp.getChildNodes();
				}
			}

			for (int i = 0; i < standardProdIdList.getLength(); i++) {
				if (standardProdIdList.item(i).getNodeName().equals("Type")) {
					prodIdType = standardProdIdList.item(i);
				} else if (standardProdIdList.item(i).getNodeName().equals("Value")) {
					prodId = standardProdIdList.item(i);
				}
			}
			System.out.println("hi");
			for (int i = 0; i < descData.getLength(); i++) {
				Node temp = descData.item(i);
				String name = temp.getNodeName();
				if (name.equals("Title")) {
					title = temp;
				} else if (name.equals("Brand")) {
					brand = temp;
				} else if (name.equals("Description")) {
					desc = temp;
				} else if (name.equals("BulletPoint")) {
					bulletPoint = temp;
				} else if (name.equals("Manufacturer")) {
					manufacturer = temp;
				} else if (name.equals("SearchTerms")) {
					searchTerms = temp;
				} else if (name.equals("RecommendedBrowseNode")) {
					recBrowseNode = temp;
				}
			}

			operationType.setTextContent(operation != null ? operation : " ");
			sku.setTextContent(amazonProduct.getSku() != null ? amazonProduct.getSku() : " ");
			merchId.setTextContent(merchantId != null ? merchantId : " ");
			prodIdType.setTextContent(
					amazonProduct.getProduct_id_type() != null ? amazonProduct.getProduct_id_type() : " ");
			prodId.setTextContent(amazonProduct.getProduct_id() != null ? amazonProduct.getProduct_id() : " ");
			prodTaxCode.setTextContent((amazonProduct.getTax_code() != null) ? (amazonProduct.getTax_code()) : " ");
			title.setTextContent(amazonProduct.getProduct_name() != null ? amazonProduct.getProduct_name() : " ");
			brand.setTextContent(amazonProduct.getBrand() != null ? amazonProduct.getBrand() : " ");
			manufacturer.setTextContent(
					amazonProduct.getManufacturer_details() != null ? amazonProduct.getManufacturer_details() : " ");
			searchTerms.setTextContent(
					amazonProduct.getSearch_keywords() != null ? amazonProduct.getSearch_keywords() : " ");
			recBrowseNode.setTextContent(
					amazonProduct.getRecommended_browse_nodes() != null ? amazonProduct.getRecommended_browse_nodes()
							: " ");
			desc.setTextContent(amazonProduct.getDescription() != null ? amazonProduct.getDescription() : " ");

			saveXML(doc, url);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return url;
	}

	protected String editUpdateInventoryXML(AmazonProduct amazonProduct, long inventory, String merchantId) {
		String url = pathUrl;
		try {
			url += "/UpdateInventory.xml";
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(url);
			System.out.println(url);
			Node root = doc.getFirstChild();
			NodeList rootChildren = root.getChildNodes();
			Node message = null, sku = null, quantity = null, merchId = null;
			NodeList headerList = null, messageList = null, inventoryList = null;
			for (int i = 0; i < rootChildren.getLength(); i++) {
				message = rootChildren.item(i);
				if (message.getNodeName().equals("Message")) {
					messageList = message.getChildNodes();
				}
				if (message.getNodeName().equals("Header")) {
					headerList = message.getChildNodes();
				}
			}
			for (int i = 0; i < headerList.getLength(); i++) {
				if (headerList.item(i).getNodeName().equals("MerchantIdentifier")) {
					merchId = headerList.item(i);
				}
			}
			for (int i = 0; i < messageList.getLength(); i++) {
				if (messageList.item(i).getNodeName().equals("Inventory")) {
					inventoryList = messageList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < inventoryList.getLength(); i++) {
				if (inventoryList.item(i).getNodeName().equals("SKU")) {
					sku = inventoryList.item(i);
				}
				if (inventoryList.item(i).getNodeName().equals("Quantity")) {
					quantity = inventoryList.item(i);
				}
			}
			String inv = Long.toString(inventory);
			merchId.setTextContent(merchantId != null ? merchantId : " ");
			sku.setTextContent(amazonProduct.getSku() != null ? amazonProduct.getSku() : " ");
			quantity.setTextContent(inv != null ? inv : " ");

			saveXML(doc, url);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return url;
	}

	protected String editUpdatePriceXML(AmazonProduct amazonProduct, String merchandId) {
		String url = pathUrl;
		try {
			url += "/UpdatePrice.xml";
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(url);
			System.out.println(url);
			Node root = doc.getFirstChild();
			NodeList rootChildren = root.getChildNodes();
			Node message = null, sku = null, stanPriceNode = null, merchId = null, mrpNode = null;
			NodeList headerList = null, messageList = null, priceList = null;
			for (int i = 0; i < rootChildren.getLength(); i++) {
				System.out.println(rootChildren.item(i).getNodeName());
			}
			for (int i = 0; i < rootChildren.getLength(); i++) {
				message = rootChildren.item(i);
				if (message.getNodeName().equals("Message")) {
					messageList = message.getChildNodes();
				}
				if (message.getNodeName().equals("Header")) {
					headerList = message.getChildNodes();
				}
			}
			for (int i = 0; i < headerList.getLength(); i++) {
				if (headerList.item(i).getNodeName().equals("MerchantIdentifier")) {
					merchId = headerList.item(i);
				}
			}
			for (int i = 0; i < messageList.getLength(); i++) {
				if (messageList.item(i).getNodeName().equals("Price")) {
					priceList = messageList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < priceList.getLength(); i++) {
				if (priceList.item(i).getNodeName().equals("SKU")) {
					sku = priceList.item(i);
				}
				if (priceList.item(i).getNodeName().equals("StandardPrice")) {
					stanPriceNode = priceList.item(i);
				}
				if (priceList.item(i).getNodeName().equals("MaximumRetailPrice")) {
					mrpNode = priceList.item(i);
				}
			}
			String spString = Double.toString(amazonProduct.getSelling_price());
			String mrpString = Double.toString(amazonProduct.getMrp());
			merchId.setTextContent(merchandId != null ? merchandId : " "); // SET SELLER ID
			sku.setTextContent(amazonProduct.getSku() != null ? amazonProduct.getSku() : " ");
			stanPriceNode.setTextContent(spString != null ? spString : " ");
			mrpNode.setTextContent(mrpString != null ? mrpString : " ");

			saveXML(doc, url);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return url;
	}

	protected String editDeleteProductXML(AmazonProduct amazonProduct) {
		String url = pathUrl;
		System.out.println("Inside editXMl");
		try {
			url += "/DeleteProduct.xml";
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(url);
			System.out.println(url);
			Node root = doc.getFirstChild();
			NodeList rootChildren = root.getChildNodes();
			Node message = null, sku = null, merchId = null, stanProdIdType = null, stanProdId = null;
			NodeList headerList = null, messageList = null, productList = null, stanProdIdList = null;
			for (int i = 0; i < rootChildren.getLength(); i++) {
				message = rootChildren.item(i);
				if (message.getNodeName().equals("Message")) {
					messageList = message.getChildNodes();
				}
				if (message.getNodeName().equals("Header")) {
					headerList = message.getChildNodes();
				}
			}
			for (int i = 0; i < headerList.getLength(); i++) {
				if (headerList.item(i).getNodeName().equals("MerchantIdentifier")) {
					merchId = headerList.item(i);
				}
			}
			for (int i = 0; i < messageList.getLength(); i++) {
				if (messageList.item(i).getNodeName().equals("Product")) {
					productList = messageList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < productList.getLength(); i++) {
				if (productList.item(i).getNodeName().equals("SKU")) {
					sku = productList.item(i);
				}
				if (productList.item(i).getNodeName().equals("StandardProductID")) {
					stanProdIdList = productList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < stanProdIdList.getLength(); i++) {
				if (stanProdIdList.item(i).getNodeName().equals("Type")) {
					stanProdIdType = stanProdIdList.item(i);
				}
				if (stanProdIdList.item(i).getNodeName().equals("Value")) {
					stanProdId = stanProdIdList.item(i);
				}
			}
			merchId.setTextContent("A1ZRT2O38J6EA0");
			sku.setTextContent(amazonProduct.getSku() != null ? amazonProduct.getSku() : " ");
			stanProdIdType.setTextContent(
					amazonProduct.getProduct_id_type() != null ? amazonProduct.getProduct_id_type() : " ");
			stanProdId.setTextContent(amazonProduct.getProduct_id() != null ? amazonProduct.getProduct_id() : " ");

			saveXML(doc, url);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return url;
	}

	protected String editUpdateImageXML(String image, String merchantId, AmazonProduct amazonProduct,
		String imageTypeString) {
		String url = pathUrl;
		System.out.println("Inside editXMl");
		try {
			url += "/UpdateImage.xml";
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(url);
			System.out.println(url);
			Node root = doc.getFirstChild();
			NodeList rootChildren = root.getChildNodes();
			Node message = null, sku = null, merchId = null, stanProdIdType = null, stanProdId = null, imageType = null,
					imageLocation = null;
			NodeList headerList = null, messageList = null, productList = null, stanProdIdList = null;
			for (int i = 0; i < rootChildren.getLength(); i++) {
				message = rootChildren.item(i);
				if (message.getNodeName().equals("Message")) {
					messageList = message.getChildNodes();
				}
				if (message.getNodeName().equals("Header")) {
					headerList = message.getChildNodes();
				}
			}
			for (int i = 0; i < headerList.getLength(); i++) {
				if (headerList.item(i).getNodeName().equals("MerchantIdentifier")) {
					merchId = headerList.item(i);
				}
			}
			for (int i = 0; i < messageList.getLength(); i++) {
				if (messageList.item(i).getNodeName().equals("ProductImage")) {
					productList = messageList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < productList.getLength(); i++) {
				if (productList.item(i).getNodeName().equals("SKU")) {
					sku = productList.item(i);
				}
				if (productList.item(i).getNodeName().equals("ImageType")) {
					imageType = productList.item(i);
				}
				if (productList.item(i).getNodeName().equals("ImageLocation")) {
					imageLocation = productList.item(i);
				}
			}
			merchId.setTextContent(merchantId != null ? merchantId : " ");
			sku.setTextContent(amazonProduct.getSku() != null ? amazonProduct.getSku() : " ");
			imageType.setTextContent(imageTypeString != null ? imageTypeString : " ");
			imageLocation.setTextContent(image != null ? image : " ");

			saveXML(doc, url);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return url;
	}

	protected String editPostOrderXML(HashMap<Object, Object> orderDetails, String merchantID) {
		String url = pathUrl;
		System.out.println("Inside editXMl");
		try {
			url += "/PostOrderAcknowledgement.xml";
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;
			docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(url);
			System.out.println(url);
			Node root = doc.getFirstChild(), merchId = null, amazonId = null, merchantId = null,
					amazonOrderItemId = null, merchOrderItemId = null, reason = null, quantity = null;
			NodeList rootChildren = root.getChildNodes(), orderList = null, item = null;
			NodeList messageList = null, headerList = null;
			for (int i = 0; i < rootChildren.getLength(); i++) {
				Node message = rootChildren.item(i);
//				System.out.println(message.getNodeName());
				if (message.getNodeName().equals("Message")) {
					messageList = message.getChildNodes();
				}
				if (message.getNodeName().equals("Header")) {
					headerList = message.getChildNodes();
				}
			}
			for (int i = 0; i < headerList.getLength(); i++) {
//				System.out.println(headerList.item(i).getNodeName());
				if (headerList.item(i).getNodeName().equals("MerchantIdentifier")) {
					merchId = headerList.item(i);
				}
			}
			for (int i = 0; i < messageList.getLength(); i++) {
//				System.out.println(messageList.item(i).getNodeName());
				if (messageList.item(i).getNodeName().equals("OrderAcknowledgement")) {
					orderList = messageList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < orderList.getLength(); i++) {
//				System.out.println(orderList.item(i).getNodeName());
				if (orderList.item(i).getNodeName().equals("AmazonOrderID")) {
					amazonId = orderList.item(i);
				}
				if (orderList.item(i).getNodeName().equals("MerchantOrderID")) {
					merchantId = orderList.item(i);
				}
				if (orderList.item(i).getNodeName().equals("Item")) {
					item = orderList.item(i).getChildNodes();
				}
			}
			for (int i = 0; i < item.getLength(); i++) {
//				System.out.println(item.item(i).getNodeName());
				if (item.item(i).getNodeName().equals("AmazonOrderItemCode")) {
					amazonOrderItemId = item.item(i);
				}
				if (item.item(i).getNodeName().equals("MerchantOrderItemID")) {
					merchOrderItemId = item.item(i);
				}
				if (item.item(i).getNodeName().equals("CancelReason")) {
					reason = item.item(i);
				}
				if (item.item(i).getNodeName().equals("Quantity")) {
					quantity = item.item(i);
				}
			}

			System.out.println(orderDetails);
			System.out.println(merchantID);

			amazonId.setTextContent(
					(orderDetails.get("AmazonOrderId") != null ? (String) orderDetails.get("AmazonOrderId") : ""));
			merchantId.setTextContent(
					(orderDetails.get("MerchantOrderId") != null ? (String) orderDetails.get("MerchantOrderId") : ""));
			amazonOrderItemId.setTextContent(
					(orderDetails.get("AmazonOrderItemId") != null ? (String) orderDetails.get("AmazonOrderItemId")
							: ""));
			merchOrderItemId.setTextContent(
					(orderDetails.get("MerchantOrderItemId") != null ? (String) orderDetails.get("MerchantOrderItemId")
							: ""));
			reason.setTextContent(
					(orderDetails.get("CancelReason") != null ? (String) orderDetails.get("CancelReason") : ""));
			quantity.setTextContent(
					(orderDetails.get("Quantity") != null ? (String) orderDetails.get("Quantity") : ""));
			merchId.setTextContent(merchantID != null ? merchantID : " ");
			saveXML(doc, url);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return url;
	}

	protected void saveXML(Document doc, String path) {
		try {
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(path));
			transformer.transform(source, result);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected static String getPath() {
		String current = null;
		current = new java.io.File(".").getPath();
		String path = "";
		for (int i = 0; i < current.length(); i++) {
			if (current.charAt(i) == '\\') {
				path += "/";
			} else {
				path += current.charAt(i);
			}
		}
		
		path = "/home/manishbothra/eclipse-workspace/connect2-ec1/src/com/connect2/ec/adapter/ec/am/xml";
		
		//path += "/src/main/java/com/connect2/ec/adapter/ec/am/xml/";
		return path;
	}
}