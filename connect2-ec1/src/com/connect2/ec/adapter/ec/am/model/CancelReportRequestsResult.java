
package com.connect2.ec.adapter.ec.am.model;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


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
 *         &lt;element name="Count" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="ReportRequestInfo" type="{http://mws.amazonaws.com/doc/2009-01-01/}ReportRequestInfo" maxOccurs="unbounded"/>
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
    "count",
    "reportRequestInfo"
})
@XmlRootElement(name = "CancelReportRequestsResult")
public class CancelReportRequestsResult {

    @XmlElement(name = "Count")
    protected int count;
    @XmlElement(name = "ReportRequestInfo", required = true)
    protected List<ReportRequestInfo> reportRequestInfo;

    /**
     * Default constructor
     * 
     */
    public CancelReportRequestsResult() {
        super();
    }

    /**
     * Value constructor
     * 
     */
    public CancelReportRequestsResult(final int count, final List<ReportRequestInfo> reportRequestInfo) {
        this.count = count;
        this.reportRequestInfo = reportRequestInfo;
    }

    /**
     * Gets the value of the count property.
     * 
     */
    public int getCount() {
        return count;
    }

    /**
     * Sets the value of the count property.
     * 
     */
    public void setCount(int value) {
        this.count = value;
    }

    public boolean isSetCount() {
        return true;
    }

    /**
     * Gets the value of the reportRequestInfo property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the reportRequestInfo property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getReportRequestInfo().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ReportRequestInfo }
     * 
     * 
     */
    public List<ReportRequestInfo> getReportRequestInfoList() {
        if (reportRequestInfo == null) {
            reportRequestInfo = new ArrayList<ReportRequestInfo>();
        }
        return this.reportRequestInfo;
    }

    public boolean isSetReportRequestInfoList() {
        return ((this.reportRequestInfo!= null)&&(!this.reportRequestInfo.isEmpty()));
    }

    public void unsetReportRequestInfoList() {
        this.reportRequestInfo = null;
    }

    /**
     * Sets the value of the Count property.
     * 
     * @param value
     * @return
     *     this instance
     */
    public CancelReportRequestsResult withCount(int value) {
        setCount(value);
        return this;
    }

    /**
     * Sets the value of the ReportRequestInfo property.
     * 
     * @param values
     * @return
     *     this instance
     */
    public CancelReportRequestsResult withReportRequestInfo(ReportRequestInfo... values) {
        for (ReportRequestInfo value: values) {
            getReportRequestInfoList().add(value);
        }
        return this;
    }

    /**
     * Sets the value of the reportRequestInfo property.
     * 
     * @param reportRequestInfoList
     *     allowed object is
     *     {@link ReportRequestInfo }
     *     
     */
    public void setReportRequestInfoList(List<ReportRequestInfo> reportRequestInfoList) {
        this.reportRequestInfo = reportRequestInfoList;
    }
    

    /**
     * 
     * XML fragment representation of this object
     * 
     * @return XML fragment for this object. Name for outer
     * tag expected to be set by calling method. This fragment
     * returns inner properties representation only
     */
    protected String toXMLFragment() {
        StringBuffer xml = new StringBuffer();
        if (isSetCount()) {
            xml.append("<Count>");
            xml.append(getCount() + "");
            xml.append("</Count>");
        }
        java.util.List<ReportRequestInfo> reportRequestInfoList = getReportRequestInfoList();
        for (ReportRequestInfo reportRequestInfo : reportRequestInfoList) {
            xml.append("<ReportRequestInfo>");
            xml.append(reportRequestInfo.toXMLFragment());
            xml.append("</ReportRequestInfo>");
        }
        return xml.toString();
    }

    /**
     * 
     * Escape XML special characters
     */
    private String escapeXML(String string) {
        StringBuffer sb = new StringBuffer();
        int length = string.length();
        for (int i = 0; i < length; ++i) {
            char c = string.charAt(i);
            switch (c) {
            case '&':
                sb.append("&amp;");
                break;
            case '<':
                sb.append("&lt;");
                break;
            case '>':
                sb.append("&gt;");
                break;
            case '\'':
                sb.append("&#039;");
                break;
            case '"':
                sb.append("&quot;");
                break;
            default:
                sb.append(c);
            }
        }
        return sb.toString();
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
        if (isSetCount()) {
            if (!first) json.append(", ");
            json.append(quoteJSON("Count"));
            json.append(" : ");
            json.append(quoteJSON(getCount() + ""));
            first = false;
        }
        if (isSetReportRequestInfoList()) {
            if (!first) json.append(", ");
            json.append("\"ReportRequestInfo\" : [");
            java.util.List<ReportRequestInfo> reportRequestInfoList = getReportRequestInfoList();
            for (ReportRequestInfo reportRequestInfo : reportRequestInfoList) {
                if (reportRequestInfoList.indexOf(reportRequestInfo) > 0) json.append(", ");
                json.append("{");
                json.append("");
                json.append(reportRequestInfo.toJSONFragment());
                json.append("}");
                first = false;
            }
            json.append("]");
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
