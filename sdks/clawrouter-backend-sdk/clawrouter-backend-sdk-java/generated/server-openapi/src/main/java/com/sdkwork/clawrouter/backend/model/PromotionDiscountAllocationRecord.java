package com.sdkwork.clawrouter.backend.model;


public class PromotionDiscountAllocationRecord {
    private String allocationAmountMinor;
    private Integer allocationRatioBps;
    private String applicationId;
    private String createdAt;
    private String currencyCode;
    private String id;
    private String orderId;
    private String orderItemId;
    private String organizationId;
    private String skuId;
    private String tenantId;

    public String getAllocationAmountMinor() {
        return this.allocationAmountMinor;
    }

    public void setAllocationAmountMinor(String allocationAmountMinor) {
        this.allocationAmountMinor = allocationAmountMinor;
    }

    public Integer getAllocationRatioBps() {
        return this.allocationRatioBps;
    }

    public void setAllocationRatioBps(Integer allocationRatioBps) {
        this.allocationRatioBps = allocationRatioBps;
    }

    public String getApplicationId() {
        return this.applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderItemId() {
        return this.orderItemId;
    }

    public void setOrderItemId(String orderItemId) {
        this.orderItemId = orderItemId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
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
