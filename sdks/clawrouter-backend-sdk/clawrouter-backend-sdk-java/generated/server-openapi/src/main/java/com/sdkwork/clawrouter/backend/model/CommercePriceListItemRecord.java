package com.sdkwork.clawrouter.backend.model;


public class CommercePriceListItemRecord {
    private String compareAtAmount;
    private String createdAt;
    private String maxQuantity;
    private String organizationId;
    private String priceAmount;
    private String priceListId;
    private String skuId;
    private String tenantId;
    private String updatedAt;

    public String getCompareAtAmount() {
        return this.compareAtAmount;
    }

    public void setCompareAtAmount(String compareAtAmount) {
        this.compareAtAmount = compareAtAmount;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getMaxQuantity() {
        return this.maxQuantity;
    }

    public void setMaxQuantity(String maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPriceAmount() {
        return this.priceAmount;
    }

    public void setPriceAmount(String priceAmount) {
        this.priceAmount = priceAmount;
    }

    public String getPriceListId() {
        return this.priceListId;
    }

    public void setPriceListId(String priceListId) {
        this.priceListId = priceListId;
    }

    public String getSkuId() {
        return this.skuId;
    }

    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
