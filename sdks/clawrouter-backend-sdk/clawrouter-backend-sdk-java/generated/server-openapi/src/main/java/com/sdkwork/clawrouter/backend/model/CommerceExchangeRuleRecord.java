package com.sdkwork.clawrouter.backend.model;


public class CommerceExchangeRuleRecord {
    private String createdAt;
    private String id;
    private String idempotencyKey;
    private String organizationId;
    private String rate;
    private String remark;
    private String requestNo;
    private String ruleNo;
    private String sourceAssetType;
    private String status;
    private String targetAssetType;
    private String tenantId;
    private String updatedAt;

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

    public String getRate() {
        return this.rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }

    public String getRemark() {
        return this.remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getRequestNo() {
        return this.requestNo;
    }

    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getRuleNo() {
        return this.ruleNo;
    }

    public void setRuleNo(String ruleNo) {
        this.ruleNo = ruleNo;
    }

    public String getSourceAssetType() {
        return this.sourceAssetType;
    }

    public void setSourceAssetType(String sourceAssetType) {
        this.sourceAssetType = sourceAssetType;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetAssetType() {
        return this.targetAssetType;
    }

    public void setTargetAssetType(String targetAssetType) {
        this.targetAssetType = targetAssetType;
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
