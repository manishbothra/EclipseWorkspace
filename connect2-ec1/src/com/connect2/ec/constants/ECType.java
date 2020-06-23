package com.connect2.ec.constants;

public enum ECType {

	AMAZON, FLIPKART, EBAY;

	public static ECType getEnum(String ctype) {
		ECType type = null;
		for (ECType ust : ECType.values()) {
			if (ust.name().equalsIgnoreCase(ctype)) {
				type = ust;
				break;
			}
		}

		return type;
	}
}
