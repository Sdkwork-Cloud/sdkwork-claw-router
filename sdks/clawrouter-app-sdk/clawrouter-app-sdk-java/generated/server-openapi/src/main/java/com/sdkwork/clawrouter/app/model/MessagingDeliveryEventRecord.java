package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class MessagingDeliveryEventRecord {
    private String createdAt;
    private String eventAt;
    private String eventType;
    private String id;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private Map<String, String> payloadRedacted;
    private String providerCode;
    private String providerEventId;
    private String providerMessageId;
    private String requestId;
    private String retentionUntil;
    private String sendAttemptId;
    private String sendRequestId;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEventAt() {
        return this.eventAt;
    }

    public void setEventAt(String eventAt) {
        this.eventAt = eventAt;
    }

    public String getEventType() {
        return this.eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
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

    public Map<String, String> getPayloadRedacted() {
        return this.payloadRedacted;
    }

    public void setPayloadRedacted(Map<String, String> payloadRedacted) {
        this.payloadRedacted = payloadRedacted;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getProviderEventId() {
        return this.providerEventId;
    }

    public void setProviderEventId(String providerEventId) {
        this.providerEventId = providerEventId;
    }

    public String getProviderMessageId() {
        return this.providerMessageId;
    }

    public void setProviderMessageId(String providerMessageId) {
        this.providerMessageId = providerMessageId;
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

    public String getSendAttemptId() {
        return this.sendAttemptId;
    }

    public void setSendAttemptId(String sendAttemptId) {
        this.sendAttemptId = sendAttemptId;
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
