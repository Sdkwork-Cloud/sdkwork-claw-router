package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiMemoryEventRecord {
    private String actorId;
    private String actorType;
    private Map<String, String> afterJson;
    private Map<String, String> beforeJson;
    private String conversationId;
    private String createdAt;
    private String decisionReason;
    private String eventType;
    private String id;
    private String invocationId;
    private Boolean legalHold;
    private String memoryId;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String requestId;
    private String retentionUntil;
    private String spaceId;
    private String status;
    private String tenantId;
    private String traceId;
    private String turnId;
    private String userId;
    private String uuid;

    public String getActorId() {
        return this.actorId;
    }

    public void setActorId(String actorId) {
        this.actorId = actorId;
    }

    public String getActorType() {
        return this.actorType;
    }

    public void setActorType(String actorType) {
        this.actorType = actorType;
    }

    public Map<String, String> getAfterJson() {
        return this.afterJson;
    }

    public void setAfterJson(Map<String, String> afterJson) {
        this.afterJson = afterJson;
    }

    public Map<String, String> getBeforeJson() {
        return this.beforeJson;
    }

    public void setBeforeJson(Map<String, String> beforeJson) {
        this.beforeJson = beforeJson;
    }

    public String getConversationId() {
        return this.conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDecisionReason() {
        return this.decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
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

    public String getInvocationId() {
        return this.invocationId;
    }

    public void setInvocationId(String invocationId) {
        this.invocationId = invocationId;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }

    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public String getMemoryId() {
        return this.memoryId;
    }

    public void setMemoryId(String memoryId) {
        this.memoryId = memoryId;
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

    public String getSpaceId() {
        return this.spaceId;
    }

    public void setSpaceId(String spaceId) {
        this.spaceId = spaceId;
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

    public String getTurnId() {
        return this.turnId;
    }

    public void setTurnId(String turnId) {
        this.turnId = turnId;
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
