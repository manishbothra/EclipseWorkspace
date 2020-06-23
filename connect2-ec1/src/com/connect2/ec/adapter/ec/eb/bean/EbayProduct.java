package com.connect2.ec.adapter.ec.eb.bean;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.connect2.ec.domain.C2IEcProdSellingInfo;
import com.connect2.ec.domain.C2IEcProduct;

public class EbayProduct {
	
	private String sku;
	private String condition;
	private String conditionDescription;
	
	private String categoryId;
	private String format;
	
	public EbayProduct(){
		
	}
	
	public C2IEcProduct getC2IEcProduct(EbayProduct ebayProduct) {
		C2IEcProduct c2iEcProduct = new C2IEcProduct();
		C2IEcProdSellingInfo sellingInfo = new C2IEcProdSellingInfo();
		
		c2iEcProduct.setSku(ebayProduct.getSku());
		
		if(ebayProduct.getProduct().getEpid()!=null) {
			c2iEcProduct.setProductId(ebayProduct.getProduct().getEpid());
			c2iEcProduct.setProductIdType("epid");
		}else if(ebayProduct.getProduct().getMpn()!=null) {
			c2iEcProduct.setProductId(ebayProduct.getProduct().getMpn());
			c2iEcProduct.setProductIdType("mpn");
		}else if(ebayProduct.getProduct().getEan().size()>0) {
			c2iEcProduct.setProductId(ebayProduct.getProduct().getEan().get(0));
			c2iEcProduct.setProductIdType("ean");
		}else if(ebayProduct.getProduct().getUpc().size()>0) {
			c2iEcProduct.setProductId(ebayProduct.getProduct().getUpc().get(0));
			c2iEcProduct.setProductIdType("upc");
		}else if(ebayProduct.getProduct().getIsbn().size()>0) {
			c2iEcProduct.setProductId(ebayProduct.getProduct().getIsbn().get(0));
			c2iEcProduct.setProductIdType("isbn");
		}
		
		c2iEcProduct.setBrand(ebayProduct.getProduct().getBrand());
		
		c2iEcProduct.setProductName(ebayProduct.getProduct().getTitle());
		
		c2iEcProduct.setPackageLength(ebayProduct.getPackageWeightAndSize().getDimensions().getLength());
		c2iEcProduct.setPackageBreadth(ebayProduct.getPackageWeightAndSize().getDimensions().getWidth());
		c2iEcProduct.setPackageHeight(ebayProduct.getPackageWeightAndSize().getDimensions().getHeight());
		c2iEcProduct.setPackageWeight(ebayProduct.getPackageWeightAndSize().getWeight().getValue());
		
		c2iEcProduct.setStock(ebayProduct.getAvailability().getPickupAtLocationAvailability().get(0).getQuantity());
		c2iEcProduct.setLocationId(ebayProduct.getAvailability().getPickupAtLocationAvailability().get(0).getMerchantLocationKey());
		sellingInfo.setProcurementSla(ebayProduct.getAvailability().getPickupAtLocationAvailability().get(0).getFulfillmentTime().getValue());
		
		c2iEcProduct.setSellingInfo(sellingInfo);
		
		return c2iEcProduct;
	}
	
	public EbayProduct(C2IEcProduct c2iEcProduct) {
		
		this.sku="";
		this.condition = "NEW";
		this.conditionDescription="";
		
		this.categoryId = c2iEcProduct.getCategoryId();
		this.format = "FIXED_PRICE";
		
		//Availability
		AvailabilityClass ac = new AvailabilityClass();
		
		ac.getPickupAtLocationAvailability().get(0).setAvailabilityType("");
		ac.getPickupAtLocationAvailability().get(0).getFulfillmentTime().setValue(c2iEcProduct.getSellingInfo().getProcurementSla());
		ac.getPickupAtLocationAvailability().get(0).getFulfillmentTime().setUnit("");
		ac.getPickupAtLocationAvailability().get(0).setMerchantLocationKey(c2iEcProduct.getLocationId());
		ac.getPickupAtLocationAvailability().get(0).setQuantity(c2iEcProduct.getStock());
		
		ac.getShipToLocationAvailability().setQuantity("");
		
		this.availability = ac;
		
		
		//Package Weight and Size
		PackageWeightAndSizeClass pwasc = new PackageWeightAndSizeClass();
		
		pwasc.getDimensions().setLength(c2iEcProduct.getPackageLength());
		pwasc.getDimensions().setWidth(c2iEcProduct.getPackageBreadth());
		pwasc.getDimensions().setHeight(c2iEcProduct.getPackageHeight());
		pwasc.getDimensions().setUnit("");
		
		pwasc.setPackageType("");
		
		pwasc.getWeight().setUnit("");
		pwasc.getWeight().setValue(c2iEcProduct.getPackageWeight());
		
		this.packageWeightAndSize=pwasc;
		
		
		//Product
		ProductClass p = new ProductClass();
		
		if(c2iEcProduct.getProductIdType().equalsIgnoreCase("epid")) {
			p.setEpid(c2iEcProduct.getProductId());
		}else if(c2iEcProduct.getProductIdType().equalsIgnoreCase("mpn")) {
			p.setMpn("mpn");
		}else if(c2iEcProduct.getProductIdType().equalsIgnoreCase("ean")) {
			p.setEan(Arrays.asList(c2iEcProduct.getProductId()));
		}else if(c2iEcProduct.getProductIdType().equalsIgnoreCase("upc")) {
			p.setUpc(Arrays.asList(c2iEcProduct.getProductId()));
		}else if(c2iEcProduct.getProductIdType().equalsIgnoreCase("isbn")) {
			p.setIsbn(Arrays.asList(c2iEcProduct.getProductId()));
		}
		
		p.setBrand(c2iEcProduct.getBrand());
		p.setDescription("");
		p.setTitle(c2iEcProduct.getProductName());
		p.setSubtitle("");
		
		this.product=p;

		//PricingSummary
		PricingSummaryClass ps = new PricingSummaryClass();
		
		ps.getPrice().setValue(c2iEcProduct.getSellingInfo().getSellingPrice()+"");
		
		this.pricingSummary = ps;
		
		//Charity
		CharityClass cc = new CharityClass();
		
		cc.setCharityId("");
		cc.setDonationPercentage("");
		
		this.charity = cc;
		
	}
	
	
	public Map<String,Object> payloadForAddProduct(EbayProduct ebayProduct) {
		Map<String,Object> payload = new HashMap<String,Object>();
		
		payload.put("categoryId", ebayProduct.getCategoryId());
		payload.put("condition", ebayProduct.getCondition());
		payload.put("format",ebayProduct.getFormat());
		
		payload.put("pricingSummary", ebayProduct.getPricingSummary());
		payload.put("product", ebayProduct.getProduct());
		payload.put("charity", ebayProduct.getCharity());
		
		return payload;
	}
	
	public Map<String,Object> payloadForUpdateInventory(EbayProduct ebayProduct) {
		Map<String,Object> payload = new HashMap<String,Object>();
		
		payload.put("availability", ebayProduct.getAvailability());
		payload.put("condition", ebayProduct.getCondition());
		payload.put("conditionDescription", ebayProduct.getConditionDescription());
		payload.put("packageWeightAndSize", ebayProduct.getPackageWeightAndSize());
		payload.put("product", ebayProduct.getProduct());
		
		return payload;
	}
	
	
	public class AvailabilityClass{
		
		public class PALA{
			private String availabilityType;
			private String merchantLocationKey;
			private int quantity;
			
			public class FulfillmentTimeClass {
				private String unit;
				private int value;
				public String getUnit() {
					return unit;
				}
				public void setUnit(String unit) {
					this.unit = unit;
				}
				public int getValue() {
					return value;
				}
				public void setValue(int value) {
					this.value = value;
				}
				
			}
			
			private FulfillmentTimeClass fulfillmentTime;
			
			public String getAvailabilityType() {
				return availabilityType;
			}
			public void setAvailabilityType(String availabilityType) {
				this.availabilityType = availabilityType;
			}
			public String getMerchantLocationKey() {
				return merchantLocationKey;
			}
			public void setMerchantLocationKey(String merchantLocationKey) {
				this.merchantLocationKey = merchantLocationKey;
			}
			public int getQuantity() {
				return quantity;
			}
			public void setQuantity(int quantity) {
				this.quantity = quantity;
			}
			public FulfillmentTimeClass getFulfillmentTime() {
				return fulfillmentTime;
			}
			public void setFulfillmentTime(FulfillmentTimeClass fulfillmentTime) {
				this.fulfillmentTime = fulfillmentTime;
			}
			
		}
		
		private List<PALA> pickupAtLocationAvailability;
		
		public class STLA{
			private String quantity;

			public String getQuantity() {
				return quantity;
			}

			public void setQuantity(String quantity) {
				this.quantity = quantity;
			}
			
		}
		
		private STLA shipToLocationAvailability;

		public List<PALA> getPickupAtLocationAvailability() {
			return pickupAtLocationAvailability;
		}

		public void setPickupAtLocationAvailability(List<PALA> pickupAtLocationAvailability) {
			this.pickupAtLocationAvailability = pickupAtLocationAvailability;
		}

		public STLA getShipToLocationAvailability() {
			return shipToLocationAvailability;
		}

		public void setShipToLocationAvailability(STLA shipToLocationAvailability) {
			this.shipToLocationAvailability = shipToLocationAvailability;
		}

	}
	
	private AvailabilityClass availability;
	
	private List<String>groupIds;
	private List<String>inventoryItemGroupKeys;
	private String locale;
	
	public class PackageWeightAndSizeClass{
		
		public class DimensionClass{
			private double height;
			private double length;
			private String unit;
			private double width;
			
			public double getHeight() {
				return height;
			}
			public void setHeight(double height) {
				this.height = height;
			}
			public double getLength() {
				return length;
			}
			public void setLength(double length) {
				this.length = length;
			}
			public String getUnit() {
				return unit;
			}
			public void setUnit(String unit) {
				this.unit = unit;
			}
			public double getWidth() {
				return width;
			}
			public void setWidth(double width) {
				this.width = width;
			}
			
		}
		
		private DimensionClass dimensions;
		
		private String packageType;
		
		public class WeightClass{
			private String unit;
			private double value;
			
			public String getUnit() {
				return unit;
			}
			public void setUnit(String unit) {
				this.unit = unit;
			}
			public double getValue() {
				return value;
			}
			public void setValue(double value) {
				this.value = value;
			}
		}
		
		private WeightClass weight;

		public DimensionClass getDimensions() {
			return dimensions;
		}

		public void setDimensions(DimensionClass dimensions) {
			this.dimensions = dimensions;
		}

		public String getPackageType() {
			return packageType;
		}

		public void setPackageType(String packageType) {
			this.packageType = packageType;
		}

		public WeightClass getWeight() {
			return weight;
		}

		public void setWeight(WeightClass weight) {
			this.weight = weight;
		}

		
	}
	
	private PackageWeightAndSizeClass packageWeightAndSize;
	
	public class ProductClass{
		
		private Map<String,Object> aspects;
		private String brand;
		private String description;
		private List<String> ean;
		private String epid;
		private List<String> imageUrls;
		private List<String> isbn;
		private String mpn;
		private String subtitle;
		private String title;
		private List<String> upc;
		
		public Map<String,Object> getAspects() {
			return aspects;
		}
		public void setAspects(Map<String,Object> aspects) {
			this.aspects = aspects;
		}
		public String getBrand() {
			return brand;
		}
		public void setBrand(String brand) {
			this.brand = brand;
		}
		public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public List<String> getEan() {
			return ean;
		}
		public void setEan(List<String> ean) {
			this.ean = ean;
		}
		public String getEpid() {
			return epid;
		}
		public void setEpid(String epid) {
			this.epid = epid;
		}
		public List<String> getImageUrls() {
			return imageUrls;
		}
		public void setImageUrls(List<String> imageUrls) {
			this.imageUrls = imageUrls;
		}
		public List<String> getIsbn() {
			return isbn;
		}
		public void setIsbn(List<String> isbn) {
			this.isbn = isbn;
		}
		public String getMpn() {
			return mpn;
		}
		public void setMpn(String mpn) {
			this.mpn = mpn;
		}
		public String getSubtitle() {
			return subtitle;
		}
		public void setSubtitle(String subtitle) {
			this.subtitle = subtitle;
		}
		public String getTitle() {
			return title;
		}
		public void setTitle(String title) {
			this.title = title;
		}
		public List<String> getUpc() {
			return upc;
		}
		public void setUpc(List<String> upc) {
			this.upc = upc;
		}
		
	}
	
	private ProductClass product;
	
	public class PricingSummaryClass{
		
		public class auctionReservePriceClass{
			private String currency;
			private String value;
			
			public String getCurrency() {
				return currency;
			}
			public void setCurrency(String currency) {
				this.currency = currency;
			}
			public String getValue() {
				return value;
			}
			public void setValue(String value) {
				this.value = value;
			}
		}
		private auctionReservePriceClass auctionReservePrice;
		
		public class auctionStartPriceClass{
			private String currency;
			private String value;
			
			public String getCurrency() {
				return currency;
			}
			public void setCurrency(String currency) {
				this.currency = currency;
			}
			public String getValue() {
				return value;
			}
			public void setValue(String value) {
				this.value = value;
			}
		}
		private auctionStartPriceClass auctionStartPrice;
		
		public class PriceClass{
			private String currency;
			private String value;
			
			public String getCurrency() {
				return currency;
			}
			public void setCurrency(String currency) {
				this.currency = currency;
			}
			public String getValue() {
				return value;
			}
			public void setValue(String value) {
				this.value = value;
			}
			
		}
		private PriceClass price;
		
		public auctionReservePriceClass getAuctionReservePrice() {
			return auctionReservePrice;
		}
		public void setAuctionReservePrice(auctionReservePriceClass auctionReservePrice) {
			this.auctionReservePrice = auctionReservePrice;
		}
		public auctionStartPriceClass getAuctionStartPrice() {
			return auctionStartPrice;
		}
		public void setAuctionStartPrice(auctionStartPriceClass auctionStartPrice) {
			this.auctionStartPrice = auctionStartPrice;
		}
		public PriceClass getPrice() {
			return price;
		}
		public void setPrice(PriceClass price) {
			this.price = price;
		}

	}
	
	private PricingSummaryClass pricingSummary;
	
	public class CharityClass{
		private String donationPercentage;
		private String charityId;
		
		public String getDonationPercentage() {
			return donationPercentage;
		}
		public void setDonationPercentage(String donationPercentage) {
			this.donationPercentage = donationPercentage;
		}
		public String getCharityId() {
			return charityId;
		}
		public void setCharityId(String charityId) {
			this.charityId = charityId;
		}
		
	}
	
	private CharityClass charity;

	
	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public String getConditionDescription() {
		return conditionDescription;
	}

	public void setConditionDescription(String conditionDescription) {
		this.conditionDescription = conditionDescription;
	}

	public AvailabilityClass getAvailability() {
		return availability;
	}

	public void setAvailability(AvailabilityClass availability) {
		this.availability = availability;
	}

	public List<String> getGroupIds() {
		return groupIds;
	}

	public void setGroupIds(List<String> groupIds) {
		this.groupIds = groupIds;
	}

	public List<String> getInventoryItemGroupKeys() {
		return inventoryItemGroupKeys;
	}

	public void setInventoryItemGroupKeys(List<String> inventoryItemGroupKeys) {
		this.inventoryItemGroupKeys = inventoryItemGroupKeys;
	}

	public String getLocale() {
		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public PackageWeightAndSizeClass getPackageWeightAndSize() {
		return packageWeightAndSize;
	}

	public void setPackageWeightAndSize(PackageWeightAndSizeClass packageWeightAndSize) {
		this.packageWeightAndSize = packageWeightAndSize;
	}

	public ProductClass getProduct() {
		return product;
	}

	public void setProduct(ProductClass product) {
		this.product = product;
	}

	public PricingSummaryClass getPricingSummary() {
		return pricingSummary;
	}

	public void setPricingSummary(PricingSummaryClass pricingSummary) {
		this.pricingSummary = pricingSummary;
	}

	public CharityClass getCharity() {
		return charity;
	}

	public void setCharity(CharityClass charity) {
		this.charity = charity;
	}
	
	
}
