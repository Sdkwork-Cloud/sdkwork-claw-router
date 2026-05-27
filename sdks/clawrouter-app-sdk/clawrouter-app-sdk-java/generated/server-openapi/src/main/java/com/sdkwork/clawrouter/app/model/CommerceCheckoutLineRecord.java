package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class CommerceCheckoutLineRecord {
    private String checkoutSessionId;
    private String createdAt;
    private String fulfillmentType;
    private String inventoryReservationId;
    private String organizationId;
    private Map<String, String> priceSnapshotJson;
    private Map<String, String> promotionSnapshotJson;
    private String purchaseType;
    private String skuId;
    private String tenantId;

    public String getCheckoutSessionId() {
        return this.checkoutSessionId;
    }

    public void setCheckoutSessionId(String checkoutSessionId) {
        this.checkoutSessionId = checkoutSessionId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFulfillmentType() {
        return this.fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public String getInventoryReservationId() {
        return this.inventoryReservationId;
    }

    public void setInventoryReservationId(String inventoryReservationId) {
        this.inventoryReservationId = inventoryReservationId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getPriceSnapshotJson() {
        return this.priceSnapshotJson;
    }

    public void setPriceSnapshotJson(Map<String, String> priceSnapshotJson) {
        this.priceSnapshotJson = priceSnapshotJson;
    }

    public Map<String, String> getPromotionSnapshotJson() {
        return this.promotionSnapshotJson;
    }

    public void setPromotionSnapshotJson(Map<String, String> promotionSnapshotJson) {
        this.promotionSnapshotJson = promotionSnapshotJson;
    }

    public String getPurchaseType() {
        return this.purchaseType;
    }

    public void setPurchaseType(String purchaseType) {
        this.purchaseType = purchaseType;
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
}
