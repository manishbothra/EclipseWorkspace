
package com.connect2.ec.adapter.ec.am.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="Marketplace" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Merchant" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ReportType" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="StartDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="EndDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="MWSAuthToken" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * Generated by AWS Code Generator
 * <p/>
 * Wed Feb 18 13:28:59 PST 2009
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "marketplace",
    "marketplaceIdList",
    "merchant",
    "reportType",
    "startDate",
    "endDate",
    "reportOptions",
    "mwsAuthToken"
})
@XmlRootElement(name = "RequestReportRequest")
public class RequestReportRequest {

    @XmlElement(name = "Marketplace")
    protected String marketplace;
    @XmlElement(name = "MarketplaceIdList")
    protected IdList marketplaceIdList;
    @XmlElement(name = "Merchant", required = true)
    protected String merchant;
    @XmlElement(name = "ReportType", required = true)
    protected String reportType;
    @XmlElement(name = "StartDate")
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar startDate;
    @XmlElement(name = "EndDate")
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar endDate;
    @XmlElement(name="ReportOptions")
    protected String reportOptions;
    @XmlElement(name = "MWSAuthToken")
    protected String mwsAuthToken;
    /**
     * Default constructor
     * 
     */
    public RequestReportRequest() {
        super();
    }

    /**
     * Value constructor
     * 
     */
    public RequestReportRequest(final String marketplace, final IdList marketplaceIdList, final String merchant,
            final String reportType, final XMLGregorianCalendar startDate, final XMLGregorianCalendar endDate,
            final String reportOptions) {
        this(marketplace, marketplaceIdList, merchant, reportType, startDate, endDate, reportOptions, null);
    }
    
    public RequestReportRequest(final String marketplace,
            final IdList marketplaceIdList,
            final String merchant,
            final String reportType, 
            final XMLGregorianCalendar startDate,
            final XMLGregorianCalendar endDate, 
            final String reportOptions,
            final String mwsAuthToken) {
        this.marketplace = marketplace;
        this.marketplaceIdList = marketplaceIdList;
        this.merchant = merchant;
        this.reportType = reportType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reportOptions = reportOptions;
        this.mwsAuthToken = mwsAuthToken;
    }
    
    public void setReportOptions(String reportOptions) {
        this.reportOptions = reportOptions;
    }
    
    public String getReportOptions() {
        return reportOptions;
    }
    
    public RequestReportRequest withReportOptions(String reportOptions) {
        setReportOptions(reportOptions);
        return this;
    }
    
    public boolean isSetReportOptions() {
        return reportOptions != null;
    }

    /**
     * Gets the value of the merchant property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMerchant() {
        return merchant;
    }

    /**
     * Sets the value of the merchant property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMerchant(String value) {
        this.merchant = value;
    }

    public boolean isSetMerchant() {
        return (this.merchant!= null);
    }
    
    /**
     * Gets the value of the marketplace property.
     * 
     * @deprecated  See {@link #setMarketplace(String)}
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMarketplace() {
        return marketplace;
    }

    /**
     * Sets the value of the marketplace property.
     * 
     * @deprecated Not used anymore.  MWS ignores this parameter, but it is left
     * in here for backwards compatibility.  
     * Use {@link #setMarketplaceIdList(IdList)} instead.
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMarketplace(String value) {
        this.marketplace = value;
    }

    /**
     * @deprecated  See {@link #setMarketplace(String)}
     */
    public boolean isSetMarketplace() {
        return (this.marketplace!= null);
    }
    
    /**
     * Sets the value of the Marketplace property.
     * 
     * @deprecated  See {@link #setMarketplace(String)}
     * @param value
     * @return
     *     this instance
     */
    public RequestReportRequest withMarketplace(String value) {
        setMarketplace(value);
        return this;
    }

    /**
     * Gets the value of the reportType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReportType() {
        return reportType;
    }

    /**
     * Sets the value of the reportType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReportType(String value) {
        this.reportType = value;
    }

    public boolean isSetReportType() {
        return (this.reportType!= null);
    }

    /**
     * Gets the value of the startDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getStartDate() {
        return startDate;
    }

    /**
     * Sets the value of the startDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setStartDate(XMLGregorianCalendar value) {
        this.startDate = value;
    }

    public boolean isSetStartDate() {
        return (this.startDate!= null);
    }

    /**
     * Gets the value of the endDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getEndDate() {
        return endDate;
    }

    /**
     * Sets the value of the endDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setEndDate(XMLGregorianCalendar value) {
        this.endDate = value;
    }

    public boolean isSetEndDate() {
        return (this.endDate!= null);
    }
    
    /**
     * Gets the value of the mwsAuthToken property.
     * 
     * possible object is
     *     {@link String}
     */
    public String getMWSAuthToken() {
    	return mwsAuthToken;
    }
    
    /**
     * Sets the value of the mwsAuthToken property
     * @param authTokenValue
     * 		allowed object is 
     * 		{@link String}
     */
    public void setMWSAuthToken(String authTokenValue) {
    	this.mwsAuthToken = authTokenValue;
    }

    public boolean isSetMWSAuthToken() {
    	return (this.mwsAuthToken!=null);
    }

    /**
     * Sets the value of the Merchant property.
     * 
     * @param value
     * @return
     *     this instance
     */
    public RequestReportRequest withMerchant(String value) {
        setMerchant(value);
        return this;
    }
    
    /**
     * Sets the value of the MWSAuthToken property.
     * 
     * @param value
     * @return
     *     this instance
     */
    public RequestReportRequest withMWSAuthToken(String value) {
        setMWSAuthToken(value);
        return this;
    }

    /**
     * Sets the value of the ReportType property.
     * 
     * @param value
     * @return
     *     this instance
     */
    public RequestReportRequest withReportType(String value) {
        setReportType(value);
        return this;
    }

    /**
     * Sets the value of the StartDate property.
     * 
     * @param value
     * @return
     *     this instance
     */
    public RequestReportRequest withStartDate(XMLGregorianCalendar value) {
        setStartDate(value);
        return this;
    }

    /**
     * Sets the value of the EndDate property.
     * 
     * @param value
     * @return
     *     this instance
     */
    public RequestReportRequest withEndDate(XMLGregorianCalendar value) {
        setEndDate(value);
        return this;
    }
    
    public void setMarketplaceIdList(IdList marketplaceIdList) {
        this.marketplaceIdList = marketplaceIdList;
    }
    
    public IdList getMarketplaceIdList() {
        return marketplaceIdList;
    }
    
    public RequestReportRequest withMarketplaceIdList(IdList marketplaceIdList) {
        setMarketplaceIdList(marketplaceIdList);
        return this;
    }
    
    public boolean isSetMarketplaceIdList() {
        return marketplaceIdList != null;
    }
    
    /**
     *
     * JSON fragment representation of this object
     *
     * @return JSON fragment for this object. Name for outer
     * object expected to be set by calling method. This fragment
     * returns inner properties representation only
     *
     */
    protected String toJSONFragment() {
        StringBuffer json = new StringBuffer();
        boolean first = true;
        if (isSetMarketplace()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("Marketplace"));
            json.append(" : ");
            json.append(quoteJSON(getMarketplace()));
            first = false;
        }
        if (isSetMerchant()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("Merchant"));
            json.append(" : ");
            json.append(quoteJSON(getMerchant()));
            first = false;
        }
        if (isSetMarketplaceIdList()) {
            if (!first) json.append(", ");
            json.append("\"MarketplaceIdList\" : {");
            IdList  marketplaceIdList = getMarketplaceIdList();


            json.append(marketplaceIdList.toJSONFragment());
            json.append("}");
            first = false;
        }
        if (isSetReportType()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("ReportType"));
            json.append(" : ");
            json.append(quoteJSON(getReportType()));
            first = false;
        }
        if (isSetReportOptions()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("ReportOptions"));
            json.append(" : ");
            json.append(quoteJSON(getReportOptions()));
            first = false;
        }
        if (isSetStartDate()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("StartDate"));
            json.append(" : ");
            json.append(quoteJSON(getStartDate() + ""));
            first = false;
        }
        if (isSetEndDate()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("EndDate"));
            json.append(" : ");
            json.append(quoteJSON(getEndDate() + ""));
            first = false;
        }
        if (isSetMWSAuthToken()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("MWSAuthToken"));
            json.append(" : ");
            json.append(quoteJSON(getMWSAuthToken()));
            first = false;
        }
        return json.toString();
    }

    /**
     *
     * Quote JSON string
     */
    private String quoteJSON(String string) {
        StringBuffer sb = new StringBuffer();
        sb.append("\"");
        int length = string.length();
        for (int i = 0; i < length; ++i) {
            char c = string.charAt(i);
            switch (c) {
            case '"':
                sb.append("\\\"");
                break;
            case '\\':
                sb.append("\\\\");
                break;
            case '/':
                sb.append("\\/");
                break;
            case '\b':
                sb.append("\\b");
                break;
            case '\f':
                sb.append("\\f");
                break;
            case '\n':
                sb.append("\\n");
                break;
            case '\r':
                sb.append("\\r");
                break;
            case '\t':
                sb.append("\\t");
                break;
            default:
                if (c <  ' ') {
                    sb.append("\\u" + String.format("%03x", Integer.valueOf(c)));
                } else {
                sb.append(c);
            }
        }
        }
        sb.append("\"");
        return sb.toString();
    }


}
