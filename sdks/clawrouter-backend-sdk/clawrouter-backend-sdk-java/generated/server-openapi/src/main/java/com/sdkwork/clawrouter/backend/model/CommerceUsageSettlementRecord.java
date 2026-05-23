package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommerceUsageSettlementRecord {
    private String accountId;
    private String accountLedgerEntryId;
    private String amount;
    private String assetType;
    private String createdAt;
    private String currency;
    private String direction;
    private String failureCode;
    private String failureMessage;
    private String id;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String orderId;
    private String organizationId;
    private String payloadHash;
    private String paymentId;
    private String points;
    private Map<String, String> priceSnapshot;
    private String requestId;
    private String retentionUntil;
    private String settledAt;
    private String settlementNo;
    private String settlementStatus;
    private String status;
    private String tenantId;
    private String tokens;
    private String traceId;
    private String usageFactId;
    private String userId;
    private String uuid;

    public String getAccountId() {
        return this.accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountLedgerEntryId() {
        return this.accountLedgerEntryId;
    }

    public void setAccountLedgerEntryId(String accountLedgerEntryId) {
        this.accountLedgerEntryId = accountLedgerEntryId;
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

    public String getCurrency() {
        return this.currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDirection() {
        return this.direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getFailureCode() {
        return this.failureCode;
    }

    public void setFailureCode(String failureCode) {
        this.failureCode = failureCode;
    }

    public String getFailureMessage() {
        return this.failureMessage;
    }

    public void setFailureMessage(String failureMessage) {
        this.failureMessage = failureMessage;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }

    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
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

    public String getPayloadHash() {
        return this.payloadHash;
    }

    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getPaymentId() {
        return this.paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getPoints() {
        return this.points;
    }

    public void setPoints(String points) {
        this.points = points;
    }

    public Map<String, String> getPriceSnapshot() {
        return this.priceSnapshot;
    }

    public void setPriceSnapshot(Map<String, String> priceSnapshot) {
        this.priceSnapshot = priceSnapshot;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }

    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getSettledAt() {
        return this.settledAt;
    }

    public void setSettledAt(String settledAt) {
        this.settledAt = settledAt;
    }

    public String getSettlementNo() {
        return this.settlementNo;
    }

    public void setSettlementNo(String settlementNo) {
        this.settlementNo = settlementNo;
    }

    public String getSettlementStatus() {
        return this.settlementStatus;
    }

    public void setSettlementStatus(String settlementStatus) {
        this.settlementStatus = settlementStatus;
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

    public String getTokens() {
        return this.tokens;
    }

    public void setTokens(String tokens) {
        this.tokens = tokens;
    }

    public String getTraceId() {
        return this.traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getUsageFactId() {
        return this.usageFactId;
    }

    public void setUsageFactId(String usageFactId) {
        this.usageFactId = usageFactId;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
