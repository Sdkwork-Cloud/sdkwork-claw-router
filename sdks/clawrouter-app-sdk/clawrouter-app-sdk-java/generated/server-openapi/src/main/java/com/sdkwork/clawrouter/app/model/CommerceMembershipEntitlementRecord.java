package com.sdkwork.clawrouter.app.model;


public class CommerceMembershipEntitlementRecord {
    private String createdAt;
    private String entitlementCode;
    private String id;
    private String name;
    private String organizationId;
    private String planId;
    private String quotaAmount;
    private String quotaPeriod;
    private String resetPolicy;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEntitlementCode() {
        return this.entitlementCode;
    }

    public void setEntitlementCode(String entitlementCode) {
        this.entitlementCode = entitlementCode;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPlanId() {
        return this.planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getQuotaAmount() {
        return this.quotaAmount;
    }

    public void setQuotaAmount(String quotaAmount) {
        this.quotaAmount = quotaAmount;
    }

    public String getQuotaPeriod() {
        return this.quotaPeriod;
    }

    public void setQuotaPeriod(String quotaPeriod) {
        this.quotaPeriod = quotaPeriod;
    }

    public String getResetPolicy() {
        return this.resetPolicy;
    }

    public void setResetPolicy(String resetPolicy) {
        this.resetPolicy = resetPolicy;
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
