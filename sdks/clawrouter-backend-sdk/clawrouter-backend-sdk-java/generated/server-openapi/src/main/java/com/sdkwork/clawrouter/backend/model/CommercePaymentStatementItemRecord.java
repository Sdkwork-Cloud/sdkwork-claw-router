package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommercePaymentStatementItemRecord {
    private String createdAt;
    private String currencyCode;
    private String feeAmount;
    private String grossAmount;
    private String id;
    private Map<String, String> metadataJson;
    private String nativeOrderNo;
    private String nativeRefundId;
    private String nativeTradeId;
    private String netAmount;
    private String occurredAt;
    private String organizationId;
    private String providerAccountId;
    private String providerCode;
    private String providerStatus;
    private String rawRowDigest;
    private String rowNo;
    private String sdkworkOutRefundNo;
    private String sdkworkOutTradeNo;
    private String settledAt;
    private String statementId;
    private String tenantId;
    private String transactionType;

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

    public String getFeeAmount() {
        return this.feeAmount;
    }

    public void setFeeAmount(String feeAmount) {
        this.feeAmount = feeAmount;
    }

    public String getGrossAmount() {
        return this.grossAmount;
    }

    public void setGrossAmount(String grossAmount) {
        this.grossAmount = grossAmount;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getMetadataJson() {
        return this.metadataJson;
    }

    public void setMetadataJson(Map<String, String> metadataJson) {
        this.metadataJson = metadataJson;
    }

    public String getNativeOrderNo() {
        return this.nativeOrderNo;
    }

    public void setNativeOrderNo(String nativeOrderNo) {
        this.nativeOrderNo = nativeOrderNo;
    }

    public String getNativeRefundId() {
        return this.nativeRefundId;
    }

    public void setNativeRefundId(String nativeRefundId) {
        this.nativeRefundId = nativeRefundId;
    }

    public String getNativeTradeId() {
        return this.nativeTradeId;
    }

    public void setNativeTradeId(String nativeTradeId) {
        this.nativeTradeId = nativeTradeId;
    }

    public String getNetAmount() {
        return this.netAmount;
    }

    public void setNetAmount(String netAmount) {
        this.netAmount = netAmount;
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

    public String getProviderStatus() {
        return this.providerStatus;
    }

    public void setProviderStatus(String providerStatus) {
        this.providerStatus = providerStatus;
    }

    public String getRawRowDigest() {
        return this.rawRowDigest;
    }

    public void setRawRowDigest(String rawRowDigest) {
        this.rawRowDigest = rawRowDigest;
    }

    public String getRowNo() {
        return this.rowNo;
    }

    public void setRowNo(String rowNo) {
        this.rowNo = rowNo;
    }

    public String getSdkworkOutRefundNo() {
        return this.sdkworkOutRefundNo;
    }

    public void setSdkworkOutRefundNo(String sdkworkOutRefundNo) {
        this.sdkworkOutRefundNo = sdkworkOutRefundNo;
    }

    public String getSdkworkOutTradeNo() {
        return this.sdkworkOutTradeNo;
    }

    public void setSdkworkOutTradeNo(String sdkworkOutTradeNo) {
        this.sdkworkOutTradeNo = sdkworkOutTradeNo;
    }

    public String getSettledAt() {
        return this.settledAt;
    }

    public void setSettledAt(String settledAt) {
        this.settledAt = settledAt;
    }

    public String getStatementId() {
        return this.statementId;
    }

    public void setStatementId(String statementId) {
        this.statementId = statementId;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTransactionType() {
        return this.transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
}
