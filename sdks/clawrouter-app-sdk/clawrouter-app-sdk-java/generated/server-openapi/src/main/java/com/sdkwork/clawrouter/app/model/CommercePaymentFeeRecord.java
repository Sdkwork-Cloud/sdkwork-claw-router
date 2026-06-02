package com.sdkwork.clawrouter.app.model;


public class CommercePaymentFeeRecord {
    private String amount;
    private String createdAt;
    private String currencyCode;
    private String feeType;
    private String id;
    private String occurredAt;
    private String organizationId;
    private String paymentAttemptId;
    private String providerAccountId;
    private String providerCode;
    private String refundId;
    private String statementItemId;
    private String tenantId;

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
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

    public String getFeeType() {
        return this.feeType;
    }

    public void setFeeType(String feeType) {
        this.feeType = feeType;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOccurredAt() {
        return this.occurredAt;
    }

    public void setOccurredAt(String occurredAt) {
        this.occurredAt = occurredAt;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPaymentAttemptId() {
        return this.paymentAttemptId;
    }

    public void setPaymentAttemptId(String paymentAttemptId) {
        this.paymentAttemptId = paymentAttemptId;
    }

    public String getProviderAccountId() {
        return this.providerAccountId;
    }

    public void setProviderAccountId(String providerAccountId) {
        this.providerAccountId = providerAccountId;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getRefundId() {
        return this.refundId;
    }

    public void setRefundId(String refundId) {
        this.refundId = refundId;
    }

    public String getStatementItemId() {
        return this.statementItemId;
    }

    public void setStatementItemId(String statementItemId) {
        this.statementItemId = statementItemId;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
