package com.connect2.ec.adapter.ec.eb.bean;

import java.util.List;

public class EbayOrder{
	
	private String buyerCheckoutNotes;
	private String creationDate;
	private boolean ebayCollectAndRemitTax;
	private List<String> fulfillmentHrefs;
	private String lastModifiedDate;
	private String legacyOrderId;
	private String orderFulfillmentStatus;
	private String orderId;
	private String orderPaymentStatus;
	private String salesRecordReference;
	private String sellerId;
	
	
	
	public class BuyerClass{
		private String username;
			
		public class TaxIdentifierClass{
			private String taxpayerId;
			private String taxIdentifierType;
			private String issuingCountry;
			
			public String getTaxpayerId() {
				return taxpayerId;
			}
			public void setTaxpayerId(String taxpayerId) {
				this.taxpayerId = taxpayerId;
			}
			public String getTaxIdentifierType() {
				return taxIdentifierType;
			}
			public void setTaxIdentifierType(String taxIdentifierType) {
				this.taxIdentifierType = taxIdentifierType;
			}
			public String getIssuingCountry() {
				return issuingCountry;
			}
			public void setIssuingCountry(String issuingCountry) {
				this.issuingCountry = issuingCountry;
			}
			
		}
		private TaxIdentifierClass taxIndentifer;
		
		public String getUsername() {
			return username;
		}
		public void setUsername(String username) {
			this.username = username;
		}
		public TaxIdentifierClass getTaxIndentifer() {
			return taxIndentifer;
		}
		public void setTaxIndentifer(TaxIdentifierClass taxIndentifer) {
			this.taxIndentifer = taxIndentifer;
		}
		
		
	}
	private BuyerClass buyer;
	
	
	
	public class CancelStatusClass{
		private String cancelledDate;
		private String cancelData;
			
		public class CancelRequestsClass{
			private String cancelCompletedDate;
			private String cancelInitiator;
			private String cancelReason;
			private String cancelRequestedDate;
			private String cancelRequestId;
			private String cancelRequestState;
			
			
			public String getCancelCompletedDate() {
				return cancelCompletedDate;
			}
			public void setCancelCompletedDate(String cancelCompletedDate) {
				this.cancelCompletedDate = cancelCompletedDate;
			}
			public String getCancelInitiator() {
				return cancelInitiator;
			}
			public void setCancelInitiator(String cancelInitiator) {
				this.cancelInitiator = cancelInitiator;
			}
			public String getCancelReason() {
				return cancelReason;
			}
			public void setCancelReason(String cancelReason) {
				this.cancelReason = cancelReason;
			}
			public String getCancelRequestedDate() {
				return cancelRequestedDate;
			}
			public void setCancelRequestedDate(String cancelRequestedDate) {
				this.cancelRequestedDate = cancelRequestedDate;
			}
			public String getCancelRequestId() {
				return cancelRequestId;
			}
			public void setCancelRequestId(String cancelRequestId) {
				this.cancelRequestId = cancelRequestId;
			}
			public String getCancelRequestState() {
				return cancelRequestState;
			}
			public void setCancelRequestState(String cancelRequestState) {
				this.cancelRequestState = cancelRequestState;
			}
				
		}
		private List<CancelRequestsClass> cancelRequests;
		
		
		public String getCancelledDate() {
			return cancelledDate;
		}
		public void setCancelledDate(String cancelledDate) {
			this.cancelledDate = cancelledDate;
		}
		public String getCancelData() {
			return cancelData;
		}
		public void setCancelData(String cancelData) {
			this.cancelData = cancelData;
		}
		public List<CancelRequestsClass> getCancelRequests() {
			return cancelRequests;
		}
		public void setCancelRequests(List<CancelRequestsClass> cancelRequests) {
			this.cancelRequests = cancelRequests;
		}
		
	}
	private CancelStatusClass cancelStatus;
	
	
	
	public class FulfillmentStartInstructionsClass{
		private String destinationTimeZone;
		private boolean ebaySupportedFulfillment;
		private String fulfillmentInstructionsType;
		private String maxEstimatedDeliveryDate;
		private String minEstimatedDeliveryDate;
		
		
		
		public class FinalDestinationAddressClass{
			private String addressLine1;
			private String addressLine2;
			private String city;
			private String countryCode;
			private String county;
			private String postalCode;
			private String stateOrProvince;
			
			public String getAddressLine1() {
				return addressLine1;
			}
			public void setAddressLine1(String addressLine1) {
				this.addressLine1 = addressLine1;
			}
			public String getAddressLine2() {
				return addressLine2;
			}
			public void setAddressLine2(String addressLine2) {
				this.addressLine2 = addressLine2;
			}
			public String getCity() {
				return city;
			}
			public void setCity(String city) {
				this.city = city;
			}
			public String getCountryCode() {
				return countryCode;
			}
			public void setCountryCode(String countryCode) {
				this.countryCode = countryCode;
			}
			public String getCounty() {
				return county;
			}
			public void setCounty(String county) {
				this.county = county;
			}
			public String getPostalCode() {
				return postalCode;
			}
			public void setPostalCode(String postalCode) {
				this.postalCode = postalCode;
			}
			public String getStateOrProvince() {
				return stateOrProvince;
			}
			public void setStateOrProvince(String stateOrProvince) {
				this.stateOrProvince = stateOrProvince;
			}
		}
		private FinalDestinationAddressClass finalDestinationAddress;
		
		
		
		public class PickupStepClass{
			private String merchantLocationKey;

			public String getMerchantLocationKey() {
				return merchantLocationKey;
			}

			public void setMerchantLocationKey(String merchantLocationKey) {
				this.merchantLocationKey = merchantLocationKey;
			}
			
		}
		private PickupStepClass pickupStep;
		
		
		
		public class ShippingStepClass{
			private String shippingCarrierCode;
			private String shippingServiceCode;
			private String shipToReferenceId;
			
			public class ShipToClass{
				private String companyName;
				private String email;
				private String fullName;
				
				public class ContactAddressClass{
					private String addressLine1;
					private String addressLine2;
					private String city;
					private String countryCode;
					private String county;
					private String postalCode;
					private String stateOrProvince;
					
					
					public String getAddressLine1() {
						return addressLine1;
					}
					public void setAddressLine1(String addressLine1) {
						this.addressLine1 = addressLine1;
					}
					public String getAddressLine2() {
						return addressLine2;
					}
					public void setAddressLine2(String addressLine2) {
						this.addressLine2 = addressLine2;
					}
					public String getCity() {
						return city;
					}
					public void setCity(String city) {
						this.city = city;
					}
					public String getCountryCode() {
						return countryCode;
					}
					public void setCountryCode(String countryCode) {
						this.countryCode = countryCode;
					}
					public String getCounty() {
						return county;
					}
					public void setCounty(String county) {
						this.county = county;
					}
					public String getPostalCode() {
						return postalCode;
					}
					public void setPostalCode(String postalCode) {
						this.postalCode = postalCode;
					}
					public String getStateOrProvince() {
						return stateOrProvince;
					}
					public void setStateOrProvince(String stateOrProvince) {
						this.stateOrProvince = stateOrProvince;
					}

				}
				private ContactAddressClass contactAddress;
				
				
				
				public String getCompanyName() {
					return companyName;
				}
				public void setCompanyName(String companyName) {
					this.companyName = companyName;
				}
				public String getEmail() {
					return email;
				}
				public void setEmail(String email) {
					this.email = email;
				}
				public String getFullName() {
					return fullName;
				}
				public void setFullName(String fullName) {
					this.fullName = fullName;
				}
				public ContactAddressClass getContactAddress() {
					return contactAddress;
				}
				public void setContactAddress(ContactAddressClass contactAddress) {
					this.contactAddress = contactAddress;
				}
				public primaryPhoneClass getPrimaryPhone() {
					return primaryPhone;
				}
				public void setPrimaryPhone(primaryPhoneClass primaryPhone) {
					this.primaryPhone = primaryPhone;
				}
				public class primaryPhoneClass{
					private String phoneNumber;

					public String getPhoneNumber() {
						return phoneNumber;
					}

					public void setPhoneNumber(String phoneNumber) {
						this.phoneNumber = phoneNumber;
					}
					
					
				}
				private primaryPhoneClass primaryPhone;
				
			}
			private ShipToClass shipTo;
			
			
			public String getShippingCarrierCode() {
				return shippingCarrierCode;
			}
			public void setShippingCarrierCode(String shippingCarrierCode) {
				this.shippingCarrierCode = shippingCarrierCode;
			}
			public String getShippingServiceCode() {
				return shippingServiceCode;
			}
			public void setShippingServiceCode(String shippingServiceCode) {
				this.shippingServiceCode = shippingServiceCode;
			}
			public String getShipToReferenceId() {
				return shipToReferenceId;
			}
			public void setShipToReferenceId(String shipToReferenceId) {
				this.shipToReferenceId = shipToReferenceId;
			}
			public ShipToClass getShipTo() {
				return shipTo;
			}
			public void setShipTo(ShipToClass shipTo) {
				this.shipTo = shipTo;
			}
			
		}
		private ShippingStepClass shippingStep;
		
		
		public String getDestinationTimeZone() {
			return destinationTimeZone;
		}
		public void setDestinationTimeZone(String destinationTimeZone) {
			this.destinationTimeZone = destinationTimeZone;
		}
		public boolean isEbaySupportedFulfillment() {
			return ebaySupportedFulfillment;
		}
		public void setEbaySupportedFulfillment(boolean ebaySupportedFulfillment) {
			this.ebaySupportedFulfillment = ebaySupportedFulfillment;
		}
		public String getFulfillmentInstructionsType() {
			return fulfillmentInstructionsType;
		}
		public void setFulfillmentInstructionsType(String fulfillmentInstructionsType) {
			this.fulfillmentInstructionsType = fulfillmentInstructionsType;
		}
		public String getMaxEstimatedDeliveryDate() {
			return maxEstimatedDeliveryDate;
		}
		public void setMaxEstimatedDeliveryDate(String maxEstimatedDeliveryDate) {
			this.maxEstimatedDeliveryDate = maxEstimatedDeliveryDate;
		}
		public String getMinEstimatedDeliveryDate() {
			return minEstimatedDeliveryDate;
		}
		public void setMinEstimatedDeliveryDate(String minEstimatedDeliveryDate) {
			this.minEstimatedDeliveryDate = minEstimatedDeliveryDate;
		}
		public FinalDestinationAddressClass getFinalDestinationAddress() {
			return finalDestinationAddress;
		}
		public void setFinalDestinationAddress(FinalDestinationAddressClass finalDestinationAddress) {
			this.finalDestinationAddress = finalDestinationAddress;
		}
		public PickupStepClass getPickupStep() {
			return pickupStep;
		}
		public void setPickupStep(PickupStepClass pickupStep) {
			this.pickupStep = pickupStep;
		}
		public ShippingStepClass getShippingStep() {
			return shippingStep;
		}
		public void setShippingStep(ShippingStepClass shippingStep) {
			this.shippingStep = shippingStep;
		}
		
	}
	private List<FulfillmentStartInstructionsClass> fulfillmentStartInstructions;
		
	
	
	public class LineItemsClass{
		private String legacyItemId;
		private String legacyVariationId;
		private String lineItemFulfillmentStatus;
		private String lineItemId;
		private String listingMarketplaceId;
		private String purchaseMarketplaceId;
		private int quantity;
		private String sku;
		private String soldFormat;
		private String title;
		
		public class AppliedPromotionsClass{
			private String description;
			private String promotionId;
			
			public class DiscountAmountClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private DiscountAmountClass discountAmount;
			
			
			public String getDescription() {
				return description;
			}
			public void setDescription(String description) {
				this.description = description;
			}
			public String getPromotionId() {
				return promotionId;
			}
			public void setPromotionId(String promotionId) {
				this.promotionId = promotionId;
			}
			public DiscountAmountClass getDiscountAmount() {
				return discountAmount;
			}
			public void setDiscountAmount(DiscountAmountClass discountAmount) {
				this.discountAmount = discountAmount;
			}
			
		}
		private List<AppliedPromotionsClass> appliedPromotions;
		
		
		public class DeliveryCostClass{
			
			public class ImportChargesClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private ImportChargesClass importCharges;
			
			public class ShippingCostClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private ShippingCostClass shippingCost;
			
			public class ShippingIntermediationFeeClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private ShippingIntermediationFeeClass shippingIntermediationFee;
			
			
			public ImportChargesClass getImportCharges() {
				return importCharges;
			}
			public void setImportCharges(ImportChargesClass importCharges) {
				this.importCharges = importCharges;
			}
			public ShippingCostClass getShippingCost() {
				return shippingCost;
			}
			public void setShippingCost(ShippingCostClass shippingCost) {
				this.shippingCost = shippingCost;
			}
			public ShippingIntermediationFeeClass getShippingIntermediationFee() {
				return shippingIntermediationFee;
			}
			public void setShippingIntermediationFee(ShippingIntermediationFeeClass shippingIntermediationFee) {
				this.shippingIntermediationFee = shippingIntermediationFee;
			}
			
		}
		private DeliveryCostClass deliveryCost;
		
		
		public class DiscountedLineItemCostClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private DiscountedLineItemCostClass discountedLineItemCost; 
		
		
		public class EbayCollectAndRemitTaxesClass{
			private String taxType;
			private String collectionMethod;
			
			public class AmountClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private AmountClass amount;
			
			
			public String getTaxType() {
				return taxType;
			}
			public void setTaxType(String taxType) {
				this.taxType = taxType;
			}
			public String getCollectionMethod() {
				return collectionMethod;
			}
			public void setCollectionMethod(String collectionMethod) {
				this.collectionMethod = collectionMethod;
			}
			public AmountClass getAmount() {
				return amount;
			}
			public void setAmount(AmountClass amount) {
				this.amount = amount;
			}
			
		}
		private List<EbayCollectAndRemitTaxesClass> ebayCollectAndRemitTaxes;
		
		
		public class GiftDetailsClass{
			private String message;
			private String recipientEmail;
			private String senderName;
			
			
			public String getMessage() {
				return message;
			}
			public void setMessage(String message) {
				this.message = message;
			}
			public String getRecipientEmail() {
				return recipientEmail;
			}
			public void setRecipientEmail(String recipientEmail) {
				this.recipientEmail = recipientEmail;
			}
			public String getSenderName() {
				return senderName;
			}
			public void setSenderName(String senderName) {
				this.senderName = senderName;
			}
			
			
		}
		private GiftDetailsClass giftDetails;
		
		
		public class LineItemCostClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private LineItemCostClass lineItemCost;
		
		
		public class LineItemFulfillmentInstructionsClass{
			private String destinationTimeZone;
			private boolean guaranteedDelivery;
			private String maxEstimatedDeliveryDate;
			private String minEstimatedDeliveryDate;
			private String shipByDate;
			private String sourceTimeZone;
			
			
			public String getDestinationTimeZone() {
				return destinationTimeZone;
			}
			public void setDestinationTimeZone(String destinationTimeZone) {
				this.destinationTimeZone = destinationTimeZone;
			}
			public boolean isGuaranteedDelivery() {
				return guaranteedDelivery;
			}
			public void setGuaranteedDelivery(boolean guaranteedDelivery) {
				this.guaranteedDelivery = guaranteedDelivery;
			}
			public String getMaxEstimatedDeliveryDate() {
				return maxEstimatedDeliveryDate;
			}
			public void setMaxEstimatedDeliveryDate(String maxEstimatedDeliveryDate) {
				this.maxEstimatedDeliveryDate = maxEstimatedDeliveryDate;
			}
			public String getMinEstimatedDeliveryDate() {
				return minEstimatedDeliveryDate;
			}
			public void setMinEstimatedDeliveryDate(String minEstimatedDeliveryDate) {
				this.minEstimatedDeliveryDate = minEstimatedDeliveryDate;
			}
			public String getShipByDate() {
				return shipByDate;
			}
			public void setShipByDate(String shipByDate) {
				this.shipByDate = shipByDate;
			}
			public String getSourceTimeZone() {
				return sourceTimeZone;
			}
			public void setSourceTimeZone(String sourceTimeZone) {
				this.sourceTimeZone = sourceTimeZone;
			}
			
		}
		private LineItemFulfillmentInstructionsClass lineItemFulfillmentInstructions;
		
		
		public class PropertiesClass{
			private boolean buyerProtection;
			private boolean fromBestOffer;
			private boolean soldViaAdCampaign;
			
			
			public boolean isBuyerProtection() {
				return buyerProtection;
			}
			public void setBuyerProtection(boolean buyerProtection) {
				this.buyerProtection = buyerProtection;
			}
			public boolean isFromBestOffer() {
				return fromBestOffer;
			}
			public void setFromBestOffer(boolean fromBestOffer) {
				this.fromBestOffer = fromBestOffer;
			}
			public boolean isSoldViaAdCampaign() {
				return soldViaAdCampaign;
			}
			public void setSoldViaAdCampaign(boolean soldViaAdCampaign) {
				this.soldViaAdCampaign = soldViaAdCampaign;
			}
			
		}
		private PropertiesClass properties;
		
		
		public class RefundsClass{
			private String refundDate;
			private String refundId;
			private String refundReferenceId;
			
			public class AmountClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private AmountClass amount;
			
			
			public String getRefundDate() {
				return refundDate;
			}
			public void setRefundDate(String refundDate) {
				this.refundDate = refundDate;
			}
			public String getRefundId() {
				return refundId;
			}
			public void setRefundId(String refundId) {
				this.refundId = refundId;
			}
			public String getRefundReferenceId() {
				return refundReferenceId;
			}
			public void setRefundReferenceId(String refundReferenceId) {
				this.refundReferenceId = refundReferenceId;
			}
			public AmountClass getAmount() {
				return amount;
			}
			public void setAmount(AmountClass amount) {
				this.amount = amount;
			}
			
		}
		private List<RefundsClass> refunds;
		
		
		public class TaxesClass{
			
			public class AmountClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private AmountClass amount;
			public AmountClass getAmount() {
				return amount;
			}
			public void setAmount(AmountClass amount) {
				this.amount = amount;
			}
			
		}
		private List<TaxesClass> taxes;
		
		
		public class TotalClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private TotalClass total;
		
		
		public String getLegacyItemId() {
			return legacyItemId;
		}
		public void setLegacyItemId(String legacyItemId) {
			this.legacyItemId = legacyItemId;
		}
		public String getLegacyVariationId() {
			return legacyVariationId;
		}
		public void setLegacyVariationId(String legacyVariationId) {
			this.legacyVariationId = legacyVariationId;
		}
		public String getLineItemFulfillmentStatus() {
			return lineItemFulfillmentStatus;
		}
		public void setLineItemFulfillmentStatus(String lineItemFulfillmentStatus) {
			this.lineItemFulfillmentStatus = lineItemFulfillmentStatus;
		}
		public String getLineItemId() {
			return lineItemId;
		}
		public void setLineItemId(String lineItemId) {
			this.lineItemId = lineItemId;
		}
		public String getListingMarketplaceId() {
			return listingMarketplaceId;
		}
		public void setListingMarketplaceId(String listingMarketplaceId) {
			this.listingMarketplaceId = listingMarketplaceId;
		}
		public String getPurchaseMarketplaceId() {
			return purchaseMarketplaceId;
		}
		public void setPurchaseMarketplaceId(String purchaseMarketplaceId) {
			this.purchaseMarketplaceId = purchaseMarketplaceId;
		}
		public int getQuantity() {
			return quantity;
		}
		public void setQuantity(int quantity) {
			this.quantity = quantity;
		}
		public String getSku() {
			return sku;
		}
		public void setSku(String sku) {
			this.sku = sku;
		}
		public String getSoldFormat() {
			return soldFormat;
		}
		public void setSoldFormat(String soldFormat) {
			this.soldFormat = soldFormat;
		}
		public String getTitle() {
			return title;
		}
		public void setTitle(String title) {
			this.title = title;
		}
		public List<AppliedPromotionsClass> getAppliedPromotions() {
			return appliedPromotions;
		}
		public void setAppliedPromotions(List<AppliedPromotionsClass> appliedPromotions) {
			this.appliedPromotions = appliedPromotions;
		}
		public DeliveryCostClass getDeliveryCost() {
			return deliveryCost;
		}
		public void setDeliveryCost(DeliveryCostClass deliveryCost) {
			this.deliveryCost = deliveryCost;
		}
		public DiscountedLineItemCostClass getDiscountedLineItemCost() {
			return discountedLineItemCost;
		}
		public void setDiscountedLineItemCost(DiscountedLineItemCostClass discountedLineItemCost) {
			this.discountedLineItemCost = discountedLineItemCost;
		}
		public List<EbayCollectAndRemitTaxesClass> getEbayCollectAndRemitTaxes() {
			return ebayCollectAndRemitTaxes;
		}
		public void setEbayCollectAndRemitTaxes(List<EbayCollectAndRemitTaxesClass> ebayCollectAndRemitTaxes) {
			this.ebayCollectAndRemitTaxes = ebayCollectAndRemitTaxes;
		}
		public GiftDetailsClass getGiftDetails() {
			return giftDetails;
		}
		public void setGiftDetails(GiftDetailsClass giftDetails) {
			this.giftDetails = giftDetails;
		}
		public LineItemCostClass getLineItemCost() {
			return lineItemCost;
		}
		public void setLineItemCost(LineItemCostClass lineItemCost) {
			this.lineItemCost = lineItemCost;
		}
		public LineItemFulfillmentInstructionsClass getLineItemFulfillmentInstructions() {
			return lineItemFulfillmentInstructions;
		}
		public void setLineItemFulfillmentInstructions(LineItemFulfillmentInstructionsClass lineItemFulfillmentInstructions) {
			this.lineItemFulfillmentInstructions = lineItemFulfillmentInstructions;
		}
		public PropertiesClass getProperties() {
			return properties;
		}
		public void setProperties(PropertiesClass properties) {
			this.properties = properties;
		}
		public List<RefundsClass> getRefunds() {
			return refunds;
		}
		public void setRefunds(List<RefundsClass> refunds) {
			this.refunds = refunds;
		}
		public List<TaxesClass> getTaxes() {
			return taxes;
		}
		public void setTaxes(List<TaxesClass> taxes) {
			this.taxes = taxes;
		}
		public TotalClass getTotal() {
			return total;
		}
		public void setTotal(TotalClass total) {
			this.total = total;
		}

		
	}
	private List<LineItemsClass> lineItems;
	
	
	
	public class PaymentSummaryClass{
		
		public class PaymentClass{
			private String paymentDate;
			private String paymentMethod;
			private String paymentReferenceId;
			private String paymentStatus;
			
			public class AmountClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private AmountClass amount;
			
			public class PaymentHoldsClass{
				private String expectedReleaseDate;
				private String holdReason;
				private String holdState;
				private String releaseDate;
				
				public class HoldAmountClass{
					private String convertedFromCurrency;
					private String convertedFromValue;
					private String currency;
					private String value;
					
					
					public String getConvertedFromCurrency() {
						return convertedFromCurrency;
					}
					public void setConvertedFromCurrency(String convertedFromCurrency) {
						this.convertedFromCurrency = convertedFromCurrency;
					}
					public String getConvertedFromValue() {
						return convertedFromValue;
					}
					public void setConvertedFromValue(String convertedFromValue) {
						this.convertedFromValue = convertedFromValue;
					}
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
				private HoldAmountClass holdAmount;
				
				public class SellerActionsToReleaseClass{
					private String sellerActionToRelease;

					public String getSellerActionToRelease() {
						return sellerActionToRelease;
					}

					public void setSellerActionToRelease(String sellerActionToRelease) {
						this.sellerActionToRelease = sellerActionToRelease;
					}
					
					
				}
				private List<SellerActionsToReleaseClass> sellerActionsToRelease;
				
				
				public String getExpectedReleaseDate() {
					return expectedReleaseDate;
				}
				public void setExpectedReleaseDate(String expectedReleaseDate) {
					this.expectedReleaseDate = expectedReleaseDate;
				}
				public String getHoldReason() {
					return holdReason;
				}
				public void setHoldReason(String holdReason) {
					this.holdReason = holdReason;
				}
				public String getHoldState() {
					return holdState;
				}
				public void setHoldState(String holdState) {
					this.holdState = holdState;
				}
				public String getReleaseDate() {
					return releaseDate;
				}
				public void setReleaseDate(String releaseDate) {
					this.releaseDate = releaseDate;
				}
				public HoldAmountClass getHoldAmount() {
					return holdAmount;
				}
				public void setHoldAmount(HoldAmountClass holdAmount) {
					this.holdAmount = holdAmount;
				}
				public List<SellerActionsToReleaseClass> getSellerActionsToRelease() {
					return sellerActionsToRelease;
				}
				public void setSellerActionsToRelease(List<SellerActionsToReleaseClass> sellerActionsToRelease) {
					this.sellerActionsToRelease = sellerActionsToRelease;
				}	
				
			}
			private List<PaymentHoldsClass> paymentHolds;
			
			
			public String getPaymentDate() {
				return paymentDate;
			}
			public void setPaymentDate(String paymentDate) {
				this.paymentDate = paymentDate;
			}
			public String getPaymentMethod() {
				return paymentMethod;
			}
			public void setPaymentMethod(String paymentMethod) {
				this.paymentMethod = paymentMethod;
			}
			public String getPaymentReferenceId() {
				return paymentReferenceId;
			}
			public void setPaymentReferenceId(String paymentReferenceId) {
				this.paymentReferenceId = paymentReferenceId;
			}
			public String getPaymentStatus() {
				return paymentStatus;
			}
			public void setPaymentStatus(String paymentStatus) {
				this.paymentStatus = paymentStatus;
			}
			public AmountClass getAmount() {
				return amount;
			}
			public void setAmount(AmountClass amount) {
				this.amount = amount;
			}
			public List<PaymentHoldsClass> getPaymentHolds() {
				return paymentHolds;
			}
			public void setPaymentHolds(List<PaymentHoldsClass> paymentHolds) {
				this.paymentHolds = paymentHolds;
			}
			
			
		}
		private List<PaymentClass> payment;
		
		
		public class RefundsClass{
			private String refundDate;
			private String refundId;
			private String refundReferenceId;
			private String refundStatus;
			
			public class AmountClass{
				private String convertedFromCurrency;
				private String convertedFromValue;
				private String currency;
				private String value;
				
				
				public String getConvertedFromCurrency() {
					return convertedFromCurrency;
				}
				public void setConvertedFromCurrency(String convertedFromCurrency) {
					this.convertedFromCurrency = convertedFromCurrency;
				}
				public String getConvertedFromValue() {
					return convertedFromValue;
				}
				public void setConvertedFromValue(String convertedFromValue) {
					this.convertedFromValue = convertedFromValue;
				}
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
			private AmountClass amount;
			public String getRefundDate() {
				return refundDate;
			}
			public void setRefundDate(String refundDate) {
				this.refundDate = refundDate;
			}
			public String getRefundId() {
				return refundId;
			}
			public void setRefundId(String refundId) {
				this.refundId = refundId;
			}
			public String getRefundReferenceId() {
				return refundReferenceId;
			}
			public void setRefundReferenceId(String refundReferenceId) {
				this.refundReferenceId = refundReferenceId;
			}
			public String getRefundStatus() {
				return refundStatus;
			}
			public void setRefundStatus(String refundStatus) {
				this.refundStatus = refundStatus;
			}
			public AmountClass getAmount() {
				return amount;
			}
			public void setAmount(AmountClass amount) {
				this.amount = amount;
			}
			
		}
		private List<RefundsClass> refunds;
		
		
		public class TotalDueSellerClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private TotalDueSellerClass totalDueSeller;
		
		
		public List<PaymentClass> getPayment() {
			return payment;
		}
		public void setPayment(List<PaymentClass> payment) {
			this.payment = payment;
		}
		public List<RefundsClass> getRefunds() {
			return refunds;
		}
		public void setRefunds(List<RefundsClass> refunds) {
			this.refunds = refunds;
		}
		public TotalDueSellerClass getTotalDueSeller() {
			return totalDueSeller;
		}
		public void setTotalDueSeller(TotalDueSellerClass totalDueSeller) {
			this.totalDueSeller = totalDueSeller;
		}
		
		
		
	}
	private PaymentSummaryClass paymentSummary;
	
	
	
	public class PricingSummaryClass{
		
		public class AdjustmentClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private AdjustmentClass adjustment;
		
		public class DeliveryCostClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private DeliveryCostClass deliveryCost;
		
		public class DeliveryDiscountClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private DeliveryDiscountClass deliveryDiscount;
		
		public class FeeClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private FeeClass fee;
		
		public class PriceDiscountSubtotalClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private PriceDiscountSubtotalClass priceDiscountSubtotal;
		
		public class PriceSubtotalClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private PriceSubtotalClass priceSubtotal;
		
		public class TaxClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private TaxClass tax;
		
		public class TotalClass{
			private String convertedFromCurrency;
			private String convertedFromValue;
			private String currency;
			private String value;
			
			public String getConvertedFromCurrency() {
				return convertedFromCurrency;
			}
			public void setConvertedFromCurrency(String convertedFromCurrency) {
				this.convertedFromCurrency = convertedFromCurrency;
			}
			public String getConvertedFromValue() {
				return convertedFromValue;
			}
			public void setConvertedFromValue(String convertedFromValue) {
				this.convertedFromValue = convertedFromValue;
			}
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
		private TotalClass total;
		
		
		public AdjustmentClass getAdjustment() {
			return adjustment;
		}
		public void setAdjustment(AdjustmentClass adjustment) {
			this.adjustment = adjustment;
		}
		public DeliveryCostClass getDeliveryCost() {
			return deliveryCost;
		}
		public void setDeliveryCost(DeliveryCostClass deliveryCost) {
			this.deliveryCost = deliveryCost;
		}
		public DeliveryDiscountClass getDeliveryDiscount() {
			return deliveryDiscount;
		}
		public void setDeliveryDiscount(DeliveryDiscountClass deliveryDiscount) {
			this.deliveryDiscount = deliveryDiscount;
		}
		public FeeClass getFee() {
			return fee;
		}
		public void setFee(FeeClass fee) {
			this.fee = fee;
		}
		public PriceDiscountSubtotalClass getPriceDiscountSubtotal() {
			return priceDiscountSubtotal;
		}
		public void setPriceDiscountSubtotal(PriceDiscountSubtotalClass priceDiscountSubtotal) {
			this.priceDiscountSubtotal = priceDiscountSubtotal;
		}
		public PriceSubtotalClass getPriceSubtotal() {
			return priceSubtotal;
		}
		public void setPriceSubtotal(PriceSubtotalClass priceSubtotal) {
			this.priceSubtotal = priceSubtotal;
		}
		public TaxClass getTax() {
			return tax;
		}
		public void setTax(TaxClass tax) {
			this.tax = tax;
		}
		public TotalClass getTotal() {
			return total;
		}
		public void setTotal(TotalClass total) {
			this.total = total;
		}
		
	}
	private PricingSummaryClass pricingSummary;
	
	
	public String getBuyerCheckoutNotes() {
		return buyerCheckoutNotes;
	}
	public void setBuyerCheckoutNotes(String buyerCheckoutNotes) {
		this.buyerCheckoutNotes = buyerCheckoutNotes;
	}
	public String getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}
	public boolean isEbayCollectAndRemitTax() {
		return ebayCollectAndRemitTax;
	}
	public void setEbayCollectAndRemitTax(boolean ebayCollectAndRemitTax) {
		this.ebayCollectAndRemitTax = ebayCollectAndRemitTax;
	}
	public List<String> getFulfillmentHrefs() {
		return fulfillmentHrefs;
	}
	public void setFulfillmentHrefs(List<String> fulfillmentHrefs) {
		this.fulfillmentHrefs = fulfillmentHrefs;
	}
	public String getLastModifiedDate() {
		return lastModifiedDate;
	}
	public void setLastModifiedDate(String lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}
	public String getLegacyOrderId() {
		return legacyOrderId;
	}
	public void setLegacyOrderId(String legacyOrderId) {
		this.legacyOrderId = legacyOrderId;
	}
	public String getOrderFulfillmentStatus() {
		return orderFulfillmentStatus;
	}
	public void setOrderFulfillmentStatus(String orderFulfillmentStatus) {
		this.orderFulfillmentStatus = orderFulfillmentStatus;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public String getOrderPaymentStatus() {
		return orderPaymentStatus;
	}
	public void setOrderPaymentStatus(String orderPaymentStatus) {
		this.orderPaymentStatus = orderPaymentStatus;
	}
	public String getSalesRecordReference() {
		return salesRecordReference;
	}
	public void setSalesRecordReference(String salesRecordReference) {
		this.salesRecordReference = salesRecordReference;
	}
	public String getSellerId() {
		return sellerId;
	}
	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}
	public BuyerClass getBuyer() {
		return buyer;
	}
	public void setBuyer(BuyerClass buyer) {
		this.buyer = buyer;
	}
	public CancelStatusClass getCancelStatus() {
		return cancelStatus;
	}
	public void setCancelStatus(CancelStatusClass cancelStatus) {
		this.cancelStatus = cancelStatus;
	}
	public List<FulfillmentStartInstructionsClass> getFulfillmentStartInstructions() {
		return fulfillmentStartInstructions;
	}
	public void setFulfillmentStartInstructions(List<FulfillmentStartInstructionsClass> fulfillmentStartInstructions) {
		this.fulfillmentStartInstructions = fulfillmentStartInstructions;
	}
	public List<LineItemsClass> getLineItems() {
		return lineItems;
	}
	public void setLineItems(List<LineItemsClass> lineItems) {
		this.lineItems = lineItems;
	}
	public PaymentSummaryClass getPaymentSummary() {
		return paymentSummary;
	}
	public void setPaymentSummary(PaymentSummaryClass paymentSummary) {
		this.paymentSummary = paymentSummary;
	}
	public PricingSummaryClass getPricingSummary() {
		return pricingSummary;
	}
	public void setPricingSummary(PricingSummaryClass pricingSummary) {
		this.pricingSummary = pricingSummary;
	}

}