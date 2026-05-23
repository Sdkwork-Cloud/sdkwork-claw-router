package com.sdkwork.clawrouter.app.model;


public class CommerceCouponRedemptionRecord {
    private String couponId;
    private String createdAt;
    private String discountAmount;
    private String idempotencyKey;
    private String orderId;
    private String organizationId;
    private String ownerUserId;
    private String redeemedAt;
    private String requestNo;
    private String rolledBackAt;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getCouponId() {
        return this.couponId;
    }

    public void setCouponId(String couponId) {
        this.couponId = couponId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDiscountAmount() {
        return this.discountAmount;
    }

    public void setDiscountAmount(String discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getIdempotencyKey() {
        return this.idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getOwnerUserId() {
        return this.ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getRedeemedAt() {
        return this.redeemedAt;
    }

    public void setRedeemedAt(String redeemedAt) {
        this.redeemedAt = redeemedAt;
    }

    public String getRequestNo() {
        return this.requestNo;
    }

    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getRolledBackAt() {
        return this.rolledBackAt;
    }

    public void setRolledBackAt(String rolledBackAt) {
        this.rolledBackAt = rolledBackAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
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
