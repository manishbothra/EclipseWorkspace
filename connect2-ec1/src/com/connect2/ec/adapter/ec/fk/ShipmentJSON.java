package com.connect2.ec.adapter.ec.fk;

public class ShipmentJSON{
	
	public String getShipmentJSON() {
		String shipmentJSON = "{" + 
				"  \"filter\": {" + 
				"    \"serviceProfiles\": [" + 
				"      \"OrderItemServiceProfile\"" + 
				"    ]," + 
				"    \"dispatchByDate\": {" + 
				"      \"fromDate\": \"DateTime\"," + 
				"      \"toDate\": \"DateTime\"" + 
				"    }," + 
				"    \"cancellationType\": \"Optional\"," + 
				"    \"type\": \"\"," + 
				"    \"dispatchAfterDate\": {" + 
				"      \"fromDate\": \"DateTime\"," + 
				"      \"toDate\": \"DateTime\"" + 
				"    }," + 
				"    \"states\": [" + 
				"      \"OrderItemStatus\"" + 
				"    ]," + 
				"    \"dispatchServiceTiers\": \"Optional\"," + 
				"    \"locationId\": \"\"," + 
				"    \"modifiedDate\": {" + 
				"      \"fromDate\": \"DateTime\"," + 
				"      \"toDate\": \"DateTime\"" + 
				"    }," + 
				"    \"shipmentTypes\": [" + 
				"      \"ShipmentType\"" + 
				"    ]," + 
				"    \"sku\": [" + 
				"      \"\"" + 
				"    ]," + 
				"    \"orderDate\": {" + 
				"      \"fromDate\": \"DateTime\"," + 
				"      \"toDate\": \"DateTime\"" + 
				"    }," + 
				"    \"cancellationDate\": {" + 
				"      \"fromDate\": \"DateTime\"," + 
				"      \"toDate\": \"DateTime\"" + 
				"    }" + 
				"  }," + 
				"  \"pagination\": {" + 
				"    \"pageSize\": \"int\"" + 
				"  }," + 
				"  \"sort\": {" + 
				"    \"field\": \"dispatchByDate\"," + 
				"    \"order\": \"asc\"" + 
				"  }" + 
				"}";	
		
		
		return shipmentJSON;
	}
}