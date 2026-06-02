package com.sdkwork.clawrouter.backend.model;


public class CommerceMembershipRecord {
    private Boolean autoRenew;
    private String createdAt;
    private String expiresAt;
    private String graceUntil;
    private String id;
    private String membershipNo;
    private String organizationId;
    private String ownerUserId;
    private String planId;
    private String sourceOrderId;
    private String sourcePaymentIntentId;
    private String startsAt;
    private String status;
    private String tenantId;
    private String updatedAt;

    public Boolean getAutoRenew() {
        return this.autoRenew;
    }

    public void setAutoRenew(Boolean autoRenew) {
        this.autoRenew = autoRenew;
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

    public String getGraceUntil() {
        return this.graceUntil;
    }

    public void setGraceUntil(String graceUntil) {
        this.graceUntil = graceUntil;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMembershipNo() {
        return this.membershipNo;
    }

    public void setMembershipNo(String membershipNo) {
        this.membershipNo = membershipNo;
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

    public String getPlanId() {
        return this.planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getSourceOrderId() {
        return this.sourceOrderId;
    }

    public void setSourceOrderId(String sourceOrderId) {
        this.sourceOrderId = sourceOrderId;
    }

    public String getSourcePaymentIntentId() {
        return this.sourcePaymentIntentId;
    }

    public void setSourcePaymentIntentId(String sourcePaymentIntentId) {
        this.sourcePaymentIntentId = sourcePaymentIntentId;
    }

    public String getStartsAt() {
        return this.startsAt;
    }

    public void setStartsAt(String startsAt) {
        this.startsAt = startsAt;
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
