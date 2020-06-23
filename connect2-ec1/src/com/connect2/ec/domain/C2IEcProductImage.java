package com.connect2.ec.domain;

public class C2IEcProductImage{
	private int ecImageId;
	private int ecProdId;
	private String imageName;
	private String view;
	private byte[] imageData;
	private String imageType;
	
	public int getEcImageId() {
		return ecImageId;
	}
	public void setEcImageId(int ecImageId) {
		this.ecImageId = ecImageId;
	}
	public int getEcProdId() {
		return ecProdId;
	}
	public void setEcProdId(int ecProdId) {
		this.ecProdId = ecProdId;
	}
	
	public byte[] getImageData() {
		return imageData;
	}
	public void setImageData(byte[] imageData) {
		this.imageData = imageData;
	}
	public String getImageType() {
		return imageType;
	}
	public void setImageType(String imageType) {
		this.imageType = imageType;
	}
	public String getImageName() {
		return imageName;
	}
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}
	public String getView() {
		return view;
	}
	public void setView(String view) {
		this.view = view;
	}
	
	
}