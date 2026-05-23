package com.sdkwork.clawrouter.backend.model;


public class CommerceProductSkuAttributeItem {
    private String attributeId;
    private String attributeName;
    private String attributeValueId;
    private String customValue;
    private String displayValue;
    private String valueCode;

    public String getAttributeId() {
        return this.attributeId;
    }

    public void setAttributeId(String attributeId) {
        this.attributeId = attributeId;
    }

    public String getAttributeName() {
        return this.attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getAttributeValueId() {
        return this.attributeValueId;
    }

    public void setAttributeValueId(String attributeValueId) {
        this.attributeValueId = attributeValueId;
    }

    public String getCustomValue() {
        return this.customValue;
    }

    public void setCustomValue(String customValue) {
        this.customValue = customValue;
    }

    public String getDisplayValue() {
        return this.displayValue;
    }

    public void setDisplayValue(String displayValue) {
        this.displayValue = displayValue;
    }

    public String getValueCode() {
        return this.valueCode;
    }

    public void setValueCode(String valueCode) {
        this.valueCode = valueCode;
    }
}
