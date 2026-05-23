package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiRuntimeInvocationEventRecord {
    private String agentRunId;
    private String agentRunStepId;
    private String agentSessionId;
    private String chatTurnId;
    private String conversationId;
    private String createdAt;
    private String eventNo;
    private String eventSource;
    private String eventType;
    private String id;
    private String invocationId;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private Map<String, String> payloadJson;
    private String requestId;
    private String retentionUntil;
    private String status;
    private String tenantId;
    private String textDelta;
    private String traceId;
    private String userId;
    private String uuid;

    public String getAgentRunId() {
        return this.agentRunId;
    }

    public void setAgentRunId(String agentRunId) {
        this.agentRunId = agentRunId;
    }

    public String getAgentRunStepId() {
        return this.agentRunStepId;
    }

    public void setAgentRunStepId(String agentRunStepId) {
        this.agentRunStepId = agentRunStepId;
    }

    public String getAgentSessionId() {
        return this.agentSessionId;
    }

    public void setAgentSessionId(String agentSessionId) {
        this.agentSessionId = agentSessionId;
    }

    public String getChatTurnId() {
        return this.chatTurnId;
    }

    public void setChatTurnId(String chatTurnId) {
        this.chatTurnId = chatTurnId;
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

    public String getEventNo() {
        return this.eventNo;
    }

    public void setEventNo(String eventNo) {
        this.eventNo = eventNo;
    }

    public String getEventSource() {
        return this.eventSource;
    }

    public void setEventSource(String eventSource) {
        this.eventSource = eventSource;
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

    public Map<String, String> getPayloadJson() {
        return this.payloadJson;
    }

    public void setPayloadJson(Map<String, String> payloadJson) {
        this.payloadJson = payloadJson;
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

    public String getTextDelta() {
        return this.textDelta;
    }

    public void setTextDelta(String textDelta) {
        this.textDelta = textDelta;
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
