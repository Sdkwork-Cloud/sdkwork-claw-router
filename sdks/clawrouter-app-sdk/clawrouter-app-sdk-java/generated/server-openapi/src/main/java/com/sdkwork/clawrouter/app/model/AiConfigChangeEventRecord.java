package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiConfigChangeEventRecord {
    private String changedObjectId;
    private String changedObjectType;
    private String configScope;
    private String configVersion;
    private String createdAt;
    private Map<String, String> eventPayload;
    private String eventStatus;
    private String id;
    private String lastErrorMessage;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private Integer publishAttempts;
    private String publishedAt;
    private String requestId;
    private String retentionUntil;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getChangedObjectId() {
        return this.changedObjectId;
    }

    public void setChangedObjectId(String changedObjectId) {
        this.changedObjectId = changedObjectId;
    }

    public String getChangedObjectType() {
        return this.changedObjectType;
    }

    public void setChangedObjectType(String changedObjectType) {
        this.changedObjectType = changedObjectType;
    }

    public String getConfigScope() {
        return this.configScope;
    }

    public void setConfigScope(String configScope) {
        this.configScope = configScope;
    }

    public String getConfigVersion() {
        return this.configVersion;
    }

    public void setConfigVersion(String configVersion) {
        this.configVersion = configVersion;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Map<String, String> getEventPayload() {
        return this.eventPayload;
    }

    public void setEventPayload(Map<String, String> eventPayload) {
        this.eventPayload = eventPayload;
    }

    public String getEventStatus() {
        return this.eventStatus;
    }

    public void setEventStatus(String eventStatus) {
        this.eventStatus = eventStatus;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastErrorMessage() {
        return this.lastErrorMessage;
    }

    public void setLastErrorMessage(String lastErrorMessage) {
        this.lastErrorMessage = lastErrorMessage;
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

    public Integer getPublishAttempts() {
        return this.publishAttempts;
    }

    public void setPublishAttempts(Integer publishAttempts) {
        this.publishAttempts = publishAttempts;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
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
