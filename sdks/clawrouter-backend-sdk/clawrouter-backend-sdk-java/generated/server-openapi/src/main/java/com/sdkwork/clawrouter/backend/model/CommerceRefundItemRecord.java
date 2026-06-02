package com.sdkwork.clawrouter.backend.model;


public class CommerceRefundItemRecord {
    private String createdAt;
    private String id;
    private String orderItemId;
    private String organizationId;
    private String quantity;
    private String refundAmount;
    private String refundId;
    private String shippingRefundAmount;
    private String taxRefundAmount;
    private String tenantId;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getQuantity() {
        return this.quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getRefundAmount() {
        return this.refundAmount;
    }

    public void setRefundAmount(String refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getRefundId() {
        return this.refundId;
    }

    public void setRefundId(String refundId) {
        this.refundId = refundId;
    }

    public String getShippingRefundAmount() {
        return this.shippingRefundAmount;
    }

    public void setShippingRefundAmount(String shippingRefundAmount) {
        this.shippingRefundAmount = shippingRefundAmount;
    }

    public String getTaxRefundAmount() {
        return this.taxRefundAmount;
    }

    public void setTaxRefundAmount(String taxRefundAmount) {
        this.taxRefundAmount = taxRefundAmount;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
