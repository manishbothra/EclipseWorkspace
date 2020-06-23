package com.connect2.ec.adapter.ec.fk;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import com.connect2.ec.adapter.ec.fk.FKProduct.packageClass.dimensions;
import com.connect2.ec.domain.C2IEcProdSellingInfo;
import com.connect2.ec.domain.C2IEcProduct;

public class FKProduct {
	
	private String sku;
	
	private String product_id;
	
	public FKProduct() {
		
	}
	
	public FKProduct(C2IEcProduct c2iEcProduct) throws IllegalAccessException, InvocationTargetException{
		
		this.product_id = c2iEcProduct.getProductId();
		
		price p=new price();
		
		p.setMrp(c2iEcProduct.getSellingInfo().getMrp());
		p.setSelling_price(c2iEcProduct.getSellingInfo().getSellingPrice());
		this.price=p;
		
		tax t=new tax();
		t.setHsn(c2iEcProduct.getHsn());
		t.setTax_code(c2iEcProduct.getTaxCode());
		this.tax=t;
		
		this.listing_status = c2iEcProduct.getSellingInfo().getListingStatus();
		
		shipping_fees sFees=new shipping_fees();
		sFees.setLocal(c2iEcProduct.getSellingInfo().getLocalDeliveryCharge());
		sFees.setZonal(c2iEcProduct.getSellingInfo().getZonalDeliveryCharge());
		sFees.setNational(c2iEcProduct.getSellingInfo().getNationalDeliveryCharge());
		this.shipping_fees=sFees;
		
		String fp = c2iEcProduct.getSellingInfo().getFullfilmentBy();
		
		if(fp.equalsIgnoreCase("Flipkart")) {
			this.fulfillment_profile="FBF";
		}else if(fp.equalsIgnoreCase("Seller")) {
			this.fulfillment_profile="NON_FBF";
		}else if(fp.equalsIgnoreCase("Flipkart and Seller Smart")) {
			this.fulfillment_profile="FBF_LITE";
		}else if(fp.equalsIgnoreCase("Seller Smart")) {
			this.fulfillment_profile="FBF_LITE";
		}
		
		fulfillment f = new fulfillment();
		f.setDispatch_sla(c2iEcProduct.getSellingInfo().getProcurementSla());
		
		
		String procurementType = c2iEcProduct.getSellingInfo().getProcurementType();
		
		if(procurementType.equalsIgnoreCase("instock")) {
			f.setProcurement_type("REGULAR");
		}else if(procurementType.equalsIgnoreCase("domestic procurement")) {
			f.setProcurement_type("DOMESTIC");
		}else if(procurementType.equalsIgnoreCase("express")) {
			f.setProcurement_type("EXPRESS");
		}else if(procurementType.equalsIgnoreCase("international")) {
			f.setProcurement_type("INTERNATIONAL");
		}else if(procurementType.equalsIgnoreCase("made to order")) {
			f.setProcurement_type("MADE_TO_ORDER");
		}

		String shippingProvider = c2iEcProduct.getSellingInfo().getShippingProvider();
		
		if(shippingProvider.equalsIgnoreCase("Flipkart")) {
			f.setShipping_provider("FLIPKART");
		}else if(shippingProvider.equalsIgnoreCase("Self ship")) {
			f.setShipping_provider("SELLER");
		}else if(shippingProvider.equalsIgnoreCase("Flipkart preferred to shelf ship")) {
			f.setShipping_provider("FLIPKART_SELLER");
		}else if(shippingProvider.equalsIgnoreCase("Self ship preferred to Flipkart")) {
			f.setShipping_provider("FLIPKART_SELLER");
		}
		
		this.fulfillment=f;
		
		List<packageClass> pc= new ArrayList<packageClass>();
		packageClass pkg = new packageClass();
		
		pkg.setName(c2iEcProduct.getCategory2());
		pkg.setDescription(c2iEcProduct.getBrand() + " " + c2iEcProduct.getCategory2());
		pkg.setWeight(c2iEcProduct.getPackageWeight());
		
		dimensions dimensions = pkg.new dimensions();
		dimensions.setLength(c2iEcProduct.getPackageLength());
		dimensions.setBreadth(c2iEcProduct.getPackageBreadth());
		dimensions.setHeight(c2iEcProduct.getPackageHeight());
		pkg.setDimensions(dimensions);
		pc.add(pkg);
		this.packages = pc;
		
		List<locationClass> lc = new ArrayList<locationClass>();
		locationClass loc = new locationClass();
		
		loc.setId(c2iEcProduct.getLocationId());
		
//		loc.setId("LOC94b28b84f9764c11a457466266ceabbd");
		loc.setInventory(""+c2iEcProduct.getStock());
		loc.setStatus("ENABLED");
		lc.add(loc);
		this.locations = lc;
		
	}

	public C2IEcProduct getC2IEcProduct(FKProduct fkProduct) {
		C2IEcProduct c2iEcProduct = new C2IEcProduct();
		C2IEcProdSellingInfo sellingInfo = new C2IEcProdSellingInfo();
		
		c2iEcProduct.setSku(fkProduct.getSku());
		
		c2iEcProduct.setProductId(fkProduct.getProduct_id());
		
		sellingInfo.setMrp(fkProduct.getPrice().getMrp());
		sellingInfo.setSellingPrice(fkProduct.getPrice().getSelling_price());
		
		c2iEcProduct.setHsn(fkProduct.getTax().getHsn());
		c2iEcProduct.setTaxCode(fkProduct.getTax().getTax_code());

		sellingInfo.setListingStatus(fkProduct.getListing_status());		
		
		sellingInfo.setLocalDeliveryCharge(fkProduct.getShipping_fees().getLocal());
		sellingInfo.setZonalDeliveryCharge(fkProduct.getShipping_fees().getZonal());
		sellingInfo.setNationalDeliveryCharge(fkProduct.getShipping_fees().getNational());
		
		sellingInfo.setFullfilmentBy(fkProduct.getFulfillment_profile());
//		sellingInfo.setProcurementSla(fkProduct.getFulfillment().getDispatch_sla());
//		sellingInfo.setProcurementType(fkProduct.getFulfillment().getProcurement_type());
//		sellingInfo.setShippingProvider(fkProduct.getFulfillment().getShipping_provider());
		
		c2iEcProduct.setPackageLength(fkProduct.getPackages().get(0).getDimensions().getLength());
		c2iEcProduct.setPackageBreadth(fkProduct.getPackages().get(0).getDimensions().getBreadth());
		c2iEcProduct.setPackageHeight(fkProduct.getPackages().get(0).getDimensions().getHeight());
		c2iEcProduct.setPackageWeight(fkProduct.getPackages().get(0).getWeight());
		
		c2iEcProduct.setStock(Integer.parseInt(fkProduct.getLocations().get(0).getInventory()));
		c2iEcProduct.setLocationId(fkProduct.getLocations().get(0).getId());
		
//		c2iEcProduct.setManufacturerDetails(fkProduct.getAddress_label().getManufacturer_details().get(0));
//		c2iEcProduct.setImporterDetails(fkProduct.getAddress_label().getImporter_details().get(0));
//		c2iEcProduct.setPackerDetails(fkProduct.getAddress_label().getPacker_details().get(0));
//		c2iEcProduct.setCountryOfOrigin(fkProduct.getAddress_label().getCountries_of_origin().get(0));
		
		c2iEcProduct.setSellingInfo(sellingInfo);
		
		return c2iEcProduct;
	}
	

	public class price{
		private double mrp;
		private double selling_price;
		private String currency;
		
		private double getMrp() {
			return mrp;
		}
		public void setMrp(double mrp) {
			this.mrp = mrp;
		}
		public double getSelling_price() {
			return selling_price;
		}
		public void setSelling_price(double selling_price) {
			this.selling_price = selling_price;
		}
		public String getCurrency() {
			return currency;
		}
		public void setCurrency(String currency) {
			this.currency = currency;
		}
		
	}
	private price price;
	
	public class tax{
		private String hsn;
		private String tax_code;
		public String getHsn() {
			return hsn;
		}
		public void setHsn(String hsn) {
			this.hsn = hsn;
		}
		public String getTax_code() {
			return tax_code;
		}
		public void setTax_code(String tax_code) {
			this.tax_code = tax_code;
		}
		
	}
	public tax tax;
	
	private String listing_id;
	private String listing_status;

	public class shipping_fees{
		private double local;
		private double zonal;
		private double national;
		private String currency;
		public double getLocal() {
			return local;
		}
		public void setLocal(double local) {
			this.local = local;
		}
		public double getZonal() {
			return zonal;
		}
		public void setZonal(double zonal) {
			this.zonal = zonal;
		}
		public double getNational() {
			return national;
		}
		public void setNational(double national) {
			this.national = national;
		}
		public String getCurrency() {
			return currency;
		}
		public void setCurrency(String currency) {
			this.currency = currency;
		}
		
	}
	private shipping_fees shipping_fees;
	
	private String fulfillment_profile;
	
	public class fulfillment{
		private int dispatch_sla;
		private String shipping_provider;
		private String procurement_type;
		public int getDispatch_sla() {
			return dispatch_sla;
		}
		public void setDispatch_sla(int dispatch_sla) {
			this.dispatch_sla = dispatch_sla;
		}
		public String getShipping_provider() {
			return shipping_provider;
		}
		public void setShipping_provider(String shipping_provider) {
			this.shipping_provider = shipping_provider;
		}
		public String getProcurement_type() {
			return procurement_type;
		}
		public void setProcurement_type(String procurement_type) {
			this.procurement_type = procurement_type;
		}
		
	}
	private fulfillment fulfillment;
	
	public class packageClass{
		private String id;
		private String name;
		public class dimensions{
			private double length;
			private double breadth;
			private double height;
			public double getLength() {
				return length;
			}
			public void setLength(double length) {
				this.length = length;
			}
			public double getBreadth() {
				return breadth;
			}
			public void setBreadth(double breadth) {
				this.breadth = breadth;
			}
			public double getHeight() {
				return height;
			}
			public void setHeight(double height) {
				this.height = height;
			}
			
			
		}
		private dimensions dimensions;
		private double weight;
		private String description;
		public class handling{
			private String fragile;

			public String getFragile() {
				return fragile;
			}

			public void setFragile(String fragile) {
				this.fragile = fragile;
			}
			
		}
		
		public dimensions getDimensions() {
			return dimensions;
		}
		public void setDimensions(dimensions dimensions) {
			this.dimensions = dimensions;
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public double getWeight() {
			return weight;
		}
		public void setWeight(double weight) {
			this.weight = weight;
		}
		public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		
		
	}
	
	private List<packageClass> packages;

	public class locationClass{
		private String id;
		private String status;
		private String inventory;
		
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public String getInventory() {
			return inventory;
		}
		public void setInventory(String inventory) {
			this.inventory = inventory;
		}
		
		
	}
	private List<locationClass> locations;
		
	public class address_label{
		List<String> manufacturer_details;
		List<String> importer_details;
		List<String> packer_details;
		List<String> countries_of_origin;
		
		public List<String> getManufacturer_details() {
			return manufacturer_details;
		}
		public void setManufacturer_details(List<String> manufacturer_details) {
			this.manufacturer_details = manufacturer_details;
		}
		public List<String> getImporter_details() {
			return importer_details;
		}
		public void setImporter_details(List<String> importer_details) {
			this.importer_details = importer_details;
		}
		public List<String> getPacker_details() {
			return packer_details;
		}
		public void setPacker_details(List<String> packer_details) {
			this.packer_details = packer_details;
		}
		public List<String> getCountries_of_origin() {
			return countries_of_origin;
		}
		public void setCountries_of_origin(List<String> countries_of_origin) {
			this.countries_of_origin = countries_of_origin;
		}
		
		
	}
	
	private address_label address_label;
	
	public class dating_label{
		private String mfg_date;
		private long shelf_life;
		
		public String getMfg_date() {
			return mfg_date;
		}
		public void setMfg_date(String mfg_date) {
			this.mfg_date = mfg_date;
		}
		public long getShelf_life() {
			return shelf_life;
		}
		public void setShelf_life(long shelf_life) {
			this.shelf_life = shelf_life;
		}
		
	}
	
	private dating_label dating_label;

	
	public C2IEcProduct getC2iEcProduct() {
		C2IEcProduct ecp = new C2IEcProduct();
		//TODO populate ecp.
		
		return ecp;
	}

	public String getListing_id() {
		return listing_id;
	}

	public void setListing_id(String listing_id) {
		this.listing_id = listing_id;
	}

	public String getProduct_id() {
		return product_id;
	}

	public void setProduct_id(String product_id) {
		this.product_id = product_id;
	}

	public String getListing_status() {
		return listing_status;
	}

	public void setListing_status(String listing_status) {
		this.listing_status = listing_status;
	}

	public String getFulfillment_profile() {
		return fulfillment_profile;
	}

	public void setFulfillment_profile(String fulfillment_profile) {
		this.fulfillment_profile = fulfillment_profile;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public List<packageClass> getPackages() {
		return packages;
	}

	public void setPackages(List<packageClass> packages) {
		this.packages = packages;
	}

	public List<locationClass> getLocations() {
		return locations;
	}

	public void setLocations(List<locationClass> locations) {
		this.locations = locations;
	}



	public price getPrice() {
		return price;
	}

	public void setPrice(price price) {
		this.price = price;
	}




	public tax getTax() {
		return tax;
	}

	public void setTax(tax tax) {
		this.tax = tax;
	}

	public shipping_fees getShipping_fees() {
		return shipping_fees;
	}

	public void setShipping_fees(shipping_fees shipping_fees) {
		this.shipping_fees = shipping_fees;
	}

	public fulfillment getFulfillment() {
		return fulfillment;
	}

	public void setFulfillment(fulfillment fulfillment) {
		this.fulfillment = fulfillment;
	}

	public address_label getAddress_label() {
		return address_label;
	}

	public void setAddress_label(address_label address_label) {
		this.address_label = address_label;
	}

	public dating_label getDating_label() {
		return dating_label;
	}

	public void setDating_label(dating_label dating_label) {
		this.dating_label = dating_label;
	}

}