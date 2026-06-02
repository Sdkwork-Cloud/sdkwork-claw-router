package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommerceProductSkuMutationRequest {
    private List<CommerceProductSkuAttributeItem> attributes;
    private String barcode;
    private String defaultCurrencyCode;
    private String defaultPriceAmount;
    private String fulfillmentType;
    private MediaResource image;
    private String productId;
    private String salesUnit;
    private String skuNo;
    private String status;
    private String taxCategory;
    private String title;

    public List<CommerceProductSkuAttributeItem> getAttributes() {
        return this.attributes;
    }

    public void setAttributes(List<CommerceProductSkuAttributeItem> attributes) {
        this.attributes = attributes;
    }

    public String getBarcode() {
        return this.barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getDefaultCurrencyCode() {
        return this.defaultCurrencyCode;
    }

    public void setDefaultCurrencyCode(String defaultCurrencyCode) {
        this.defaultCurrencyCode = defaultCurrencyCode;
    }

    public String getDefaultPriceAmount() {
        return this.defaultPriceAmount;
    }

    public void setDefaultPriceAmount(String defaultPriceAmount) {
        this.defaultPriceAmount = defaultPriceAmount;
    }

    public String getFulfillmentType() {
        return this.fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public MediaResource getImage() {
        return this.image;
    }

    public void setImage(MediaResource image) {
        this.image = image;
    }

    public String getProductId() {
        return this.productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getSalesUnit() {
        return this.salesUnit;
    }

    public void setSalesUnit(String salesUnit) {
        this.salesUnit = salesUnit;
    }

    public String getSkuNo() {
        return this.skuNo;
    }

    public void setSkuNo(String skuNo) {
        this.skuNo = skuNo;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTaxCategory() {
        return this.taxCategory;
    }

    public void setTaxCategory(String taxCategory) {
        this.taxCategory = taxCategory;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
