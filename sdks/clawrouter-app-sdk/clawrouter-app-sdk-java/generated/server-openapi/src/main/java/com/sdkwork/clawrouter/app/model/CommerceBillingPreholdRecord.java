package com.sdkwork.clawrouter.app.model;


public class CommerceBillingPreholdRecord {
    private String accountId;
    private String amount;
    private String assetType;
    private String createdAt;
    private String expiresAt;
    private String idempotencyKey;
    private String organizationId;
    private String ownerUserId;
    private String preholdNo;
    private String releasedAt;
    private String requestNo;
    private String settledAt;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getAccountId() {
        return this.accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getAssetType() {
        return this.assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getIdempotencyKey() {
        return this.idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
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

    public String getPreholdNo() {
        return this.preholdNo;
    }

    public void setPreholdNo(String preholdNo) {
        this.preholdNo = preholdNo;
    }

    public String getReleasedAt() {
        return this.releasedAt;
    }

    public void setReleasedAt(String releasedAt) {
        this.releasedAt = releasedAt;
    }

    public String getRequestNo() {
        return this.requestNo;
    }

    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getSettledAt() {
        return this.settledAt;
    }

    public void setSettledAt(String settledAt) {
        this.settledAt = settledAt;
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
