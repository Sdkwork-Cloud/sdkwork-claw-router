package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CommerceProductSkuItem {
    private List<CommerceProductSkuAttributeItem> attributes;
    private String createdAt;
    private String defaultCurrencyCode;
    private String defaultPriceAmount;
    private String fulfillmentType;
    private String id;
    private String productId;
    private String publishedAt;
    private String salesUnit;
    private String skuNo;
    private String status;
    private String taxCategory;
    private String title;
    private String updatedAt;

    public List<CommerceProductSkuAttributeItem> getAttributes() {
        return this.attributes;
    }

    public void setAttributes(List<CommerceProductSkuAttributeItem> attributes) {
        this.attributes = attributes;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
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

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return this.productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
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

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
