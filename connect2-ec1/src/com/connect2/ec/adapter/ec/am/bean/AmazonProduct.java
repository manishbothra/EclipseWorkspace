package com.connect2.ec.adapter.ec.am.bean;

import java.util.List;

public class AmazonProduct {
	private int ec_prod_id;
	private int ec_store_id;
	private String part_no;
	private String sku;
	private String product_id; 
	private String product_id_type;  //NEW
	private String product_name;
	private String brand;
	private String description;
	private List<String> bullet_points;		//NEW
	private String listing_status;
	private double mrp;
	private double selling_price;
	private int stock;
	private int item_pack_quantity;		//NEW
	private int no_of_items;		//NO OF ITEMS IN ONE PACK
	private String hsn;
	private String tax_code;
	private String fullfilment_by;
	private int procurement_sla;  //aka Handling
	private String shipping_provider;
	private Double local_delivery_charge;
	private Double national_delivery_charge;
	private Double zonal_delivery_charge;
	private String manufacturer_details;
	private String brand_color;
	private String condition;		 //NEW OLD
	private String main_img;
	private double package_length;
	private double package_breadth;
	private double package_height;
	private String material;
	private boolean expirationTypeProduct;
	private String item_type; 		//NEW
	private String recommended_browse_nodes;		//NEW
	private String gtin;
	private String category;
	
	private String size;
	private Double package_weight;
	
	
	public void setLocal_delivery_charge(Double local_delivery_charge) {
		this.local_delivery_charge = local_delivery_charge;
	}
	public String getGtin() {
		return gtin;
	}
	public void setGtin(String gtin) {
		this.gtin = gtin;
	}
	public String getSearch_keywords() {
		return search_keywords;
	}
	public void setSearch_keywords(String search_keywords) {
		this.search_keywords = search_keywords;
	}
	private String search_keywords;
	public int getEc_prod_id() {
		return ec_prod_id;
	}
	public void setEc_prod_id(int ec_prod_id) {
		this.ec_prod_id = ec_prod_id;
	}
	public int getEc_store_id() {
		return ec_store_id;
	}
	public void setEc_store_id(int ec_store_id) {
		this.ec_store_id = ec_store_id;
	}
	public String getPart_no() {
		return part_no;
	}
	public void setPart_no(String part_no) {
		this.part_no = part_no;
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String sku) {
		this.sku = sku;
	}
	public String getProduct_id() {
		return product_id;
	}
	public void setProduct_id(String product_id) {
		this.product_id = product_id;
	}
	public String getProduct_id_type() {
		return product_id_type;
	}
	public void setProduct_id_type(String product_id_type) {
		this.product_id_type = product_id_type;
	}
	public String getProduct_name() {
		return product_name;
	}
	public void setProduct_name(String product_name) {
		this.product_name = product_name;
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
	public List<String> getBullet_points() {
		return bullet_points;
	}
	public void setBullet_points(List<String> bullet_points) {
		this.bullet_points = bullet_points;
	}
	public String getListing_status() {
		return listing_status;
	}
	public void setListing_status(String listing_status) {
		this.listing_status = listing_status;
	}
	public double getMrp() {
		return mrp;
	}
	public void setMrp(double d) {
		this.mrp = d;
	}
	public double getSelling_price() {
		return selling_price;
	}
	public void setSelling_price(double d) {
		this.selling_price = d;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int stock) {
		this.stock = stock;
	}
	public int getItem_pack_quantity() {
		return item_pack_quantity;
	}
	public void setItem_pack_quantity(int item_pack_quantity) {
		this.item_pack_quantity = item_pack_quantity;
	}
	public int getNo_of_items() {
		return no_of_items;
	}
	public void setNo_of_items(int no_of_items) {
		this.no_of_items = no_of_items;
	}
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
	public String getFullfilment_by() {
		return fullfilment_by;
	}
	public void setFullfilment_by(String fullfilment_by) {
		this.fullfilment_by = fullfilment_by;
	}
	public int getProcurement_sla() {
		return procurement_sla;
	}
	public void setProcurement_sla(int i) {
		this.procurement_sla = i;
	}
	public String getShipping_provider() {
		return shipping_provider;
	}
	public void setShipping_provider(String shipping_provider) {
		this.shipping_provider = shipping_provider;
	}
	public Double getLocal_delivery_charge() {
		return local_delivery_charge;
	}
	public void setLocal_delivery_charge(double d) {
		this.local_delivery_charge = d;
	}
	public Double getNational_delivery_charge() {
		return national_delivery_charge;
	}
	public void setNational_delivery_charge(Double national_delivery_charge) {
		this.national_delivery_charge = national_delivery_charge;
	}
	public Double getZonal_delivery_charge() {
		return zonal_delivery_charge;
	}
	public void setZonal_delivery_charge(Double zonal_delivery_charge) {
		this.zonal_delivery_charge = zonal_delivery_charge;
	}
	public String getManufacturer_details() {
		return manufacturer_details;
	}
	public void setManufacturer_details(String manufacturer_details) {
		this.manufacturer_details = manufacturer_details;
	}
	public String getBrand_color() {
		return brand_color;
	}
	public void setBrand_color(String brand_color) {
		this.brand_color = brand_color;
	}
	public String getCondition() {
		return condition;
	}
	public void setCondition(String condition) {
		this.condition = condition;
	}
	public String getMain_img() {
		return main_img;
	}
	public void setMain_img(String main_img) {
		this.main_img = main_img;
	}
	public double getPackage_length() {
		return package_length;
	}
	public void setPackage_length(double package_length) {
		this.package_length = package_length;
	}
	public double getPackage_breadth() {
		return package_breadth;
	}
	public void setPackage_breadth(double d) {
		this.package_breadth = d;
	}
	public double getPackage_height() {
		return package_height;
	}
	public void setPackage_height(double package_height) {
		this.package_height = package_height;
	}
	public String getMaterial() {
		return material;
	}
	public void setMaterial(String material) {
		this.material = material;
	}
	public boolean isExpirationTypeProduct() {
		return expirationTypeProduct;
	}
	public void setExpirationTypeProduct(boolean expirationTypeProduct) {
		this.expirationTypeProduct = expirationTypeProduct;
	}
	public String getItem_type() {
		return item_type;
	}
	public void setItem_type(String item_type) {
		this.item_type = item_type;
	}
	public String getRecommended_browse_nodes() {
		return recommended_browse_nodes;
	}
	public void setRecommended_browse_nodes(String recommended_browse_nodes) {
		this.recommended_browse_nodes = recommended_browse_nodes;
	}
	public Double getPackage_weight() {
		return package_weight;
	}
	public void setPackage_weight(Double package_weight) {
		this.package_weight = package_weight;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
}
