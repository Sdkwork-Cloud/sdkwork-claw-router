package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiChatMessageRecord {
    private Map<String, String> contentJson;
    private String contentText;
    private String conversationId;
    private String createdAt;
    private String direction;
    private String finishReason;
    private String id;
    private String itemId;
    private Boolean legalHold;
    private String messageKind;
    private String messageNo;
    private Map<String, String> metadata;
    private String model;
    private String organizationId;
    private String payloadHash;
    private String provider;
    private Map<String, String> rawProviderJson;
    private String requestId;
    private String retentionUntil;
    private String role;
    private String runtime;
    private String runtimeInvocationId;
    private String status;
    private String tenantId;
    private String tokenCount;
    private String traceId;
    private String turnId;
    private String usageLinkId;
    private String userId;
    private String uuid;

    public Map<String, String> getContentJson() {
        return this.contentJson;
    }

    public void setContentJson(Map<String, String> contentJson) {
        this.contentJson = contentJson;
    }

    public String getContentText() {
        return this.contentText;
    }

    public void setContentText(String contentText) {
        this.contentText = contentText;
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

    public String getDirection() {
        return this.direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getFinishReason() {
        return this.finishReason;
    }

    public void setFinishReason(String finishReason) {
        this.finishReason = finishReason;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getItemId() {
        return this.itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }

    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public String getMessageKind() {
        return this.messageKind;
    }

    public void setMessageKind(String messageKind) {
        this.messageKind = messageKind;
    }

    public String getMessageNo() {
        return this.messageNo;
    }

    public void setMessageNo(String messageNo) {
        this.messageNo = messageNo;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
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

    public String getProvider() {
        return this.provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public Map<String, String> getRawProviderJson() {
        return this.rawProviderJson;
    }

    public void setRawProviderJson(Map<String, String> rawProviderJson) {
        this.rawProviderJson = rawProviderJson;
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

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRuntime() {
        return this.runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public String getRuntimeInvocationId() {
        return this.runtimeInvocationId;
    }

    public void setRuntimeInvocationId(String runtimeInvocationId) {
        this.runtimeInvocationId = runtimeInvocationId;
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

    public String getTokenCount() {
        return this.tokenCount;
    }

    public void setTokenCount(String tokenCount) {
        this.tokenCount = tokenCount;
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

    public String getUsageLinkId() {
        return this.usageLinkId;
    }

    public void setUsageLinkId(String usageLinkId) {
        this.usageLinkId = usageLinkId;
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
