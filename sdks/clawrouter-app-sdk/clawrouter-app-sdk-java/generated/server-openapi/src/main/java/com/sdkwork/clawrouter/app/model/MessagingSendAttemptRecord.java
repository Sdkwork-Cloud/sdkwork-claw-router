package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class MessagingSendAttemptRecord {
    private Integer attemptNo;
    private String attemptedAt;
    private String createdAt;
    private String failureCode;
    private String failureMessageMasked;
    private Integer httpStatus;
    private String id;
    private Integer latencyMs;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String providerAccountId;
    private String providerCode;
    private String providerMessageId;
    private String providerRequestId;
    private String providerStatus;
    private String requestId;
    private String retentionUntil;
    private String retryAfterAt;
    private String sendRequestId;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public Integer getAttemptNo() {
        return this.attemptNo;
    }

    public void setAttemptNo(Integer attemptNo) {
        this.attemptNo = attemptNo;
    }

    public String getAttemptedAt() {
        return this.attemptedAt;
    }

    public void setAttemptedAt(String attemptedAt) {
        this.attemptedAt = attemptedAt;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFailureCode() {
        return this.failureCode;
    }

    public void setFailureCode(String failureCode) {
        this.failureCode = failureCode;
    }

    public String getFailureMessageMasked() {
        return this.failureMessageMasked;
    }

    public void setFailureMessageMasked(String failureMessageMasked) {
        this.failureMessageMasked = failureMessageMasked;
    }

    public Integer getHttpStatus() {
        return this.httpStatus;
    }

    public void setHttpStatus(Integer httpStatus) {
        this.httpStatus = httpStatus;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLatencyMs() {
        return this.latencyMs;
    }

    public void setLatencyMs(Integer latencyMs) {
        this.latencyMs = latencyMs;
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

    public String getProviderMessageId() {
        return this.providerMessageId;
    }

    public void setProviderMessageId(String providerMessageId) {
        this.providerMessageId = providerMessageId;
    }

    public String getProviderRequestId() {
        return this.providerRequestId;
    }

    public void setProviderRequestId(String providerRequestId) {
        this.providerRequestId = providerRequestId;
    }

    public String getProviderStatus() {
        return this.providerStatus;
    }

    public void setProviderStatus(String providerStatus) {
        this.providerStatus = providerStatus;
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

    public String getRetryAfterAt() {
        return this.retryAfterAt;
    }

    public void setRetryAfterAt(String retryAfterAt) {
        this.retryAfterAt = retryAfterAt;
    }

    public String getSendRequestId() {
        return this.sendRequestId;
    }

    public void setSendRequestId(String sendRequestId) {
        this.sendRequestId = sendRequestId;
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

    public String getTraceId() {
        return this.traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
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
