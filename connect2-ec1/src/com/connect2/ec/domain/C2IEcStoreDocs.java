package com.connect2.ec.domain;

import java.util.Map;

public class C2IEcStoreDocs{
	
	private int ecDocId;
	private int ecStoreId;
	private String documentName;
	private String documentType;
	private byte[] documentData;
	private Map<String, Object> documentMeta;
	
	
	public int getEcDocId() {
		return ecDocId;
	}
	public void setEcDocId(int ecDocId) {
		this.ecDocId = ecDocId;
	}
	public int getEcStoreId() {
		return ecStoreId;
	}
	public void setEcStoreId(int ecStoreId) {
		this.ecStoreId = ecStoreId;
	}
	public String getDocumentName() {
		return documentName;
	}
	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}
	public String getDocumentType() {
		return documentType;
	}
	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}
	public byte[] getDocumentData() {
		return documentData;
	}
	public void setDocumentData(byte[] documentData) {
		this.documentData = documentData;
	}
	public Map<String, Object> getDocumentMeta() {
		return documentMeta;
	}
	public void setDocumentMeta(Map<String, Object> documentMeta) {
		this.documentMeta = documentMeta;
	}
	
	
}