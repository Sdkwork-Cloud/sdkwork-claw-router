package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiChatContextSnapshotRecord {
    private Map<String, String> contextJson;
    private String conversationId;
    private String createdAt;
    private Map<String, String> excludedItemIds;
    private Map<String, String> excludedMemoryIds;
    private String id;
    private Map<String, String> includedItemIds;
    private Map<String, String> includedMemoryIds;
    private String inputTokenEstimate;
    private Boolean legalHold;
    private Map<String, String> memoryPack;
    private String memoryTokenCount;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String previousResponseId;
    private String providerConversationId;
    private String requestId;
    private String retentionUntil;
    private String runtimeInvocationId;
    private Integer snapshotNo;
    private String status;
    private String strategy;
    private String tenantId;
    private String traceId;
    private String truncationReason;
    private String turnId;
    private String userId;
    private String uuid;

    public Map<String, String> getContextJson() {
        return this.contextJson;
    }

    public void setContextJson(Map<String, String> contextJson) {
        this.contextJson = contextJson;
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

    public Map<String, String> getExcludedItemIds() {
        return this.excludedItemIds;
    }

    public void setExcludedItemIds(Map<String, String> excludedItemIds) {
        this.excludedItemIds = excludedItemIds;
    }

    public Map<String, String> getExcludedMemoryIds() {
        return this.excludedMemoryIds;
    }

    public void setExcludedMemoryIds(Map<String, String> excludedMemoryIds) {
        this.excludedMemoryIds = excludedMemoryIds;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getIncludedItemIds() {
        return this.includedItemIds;
    }

    public void setIncludedItemIds(Map<String, String> includedItemIds) {
        this.includedItemIds = includedItemIds;
    }

    public Map<String, String> getIncludedMemoryIds() {
        return this.includedMemoryIds;
    }

    public void setIncludedMemoryIds(Map<String, String> includedMemoryIds) {
        this.includedMemoryIds = includedMemoryIds;
    }

    public String getInputTokenEstimate() {
        return this.inputTokenEstimate;
    }

    public void setInputTokenEstimate(String inputTokenEstimate) {
        this.inputTokenEstimate = inputTokenEstimate;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }

    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public Map<String, String> getMemoryPack() {
        return this.memoryPack;
    }

    public void setMemoryPack(Map<String, String> memoryPack) {
        this.memoryPack = memoryPack;
    }

    public String getMemoryTokenCount() {
        return this.memoryTokenCount;
    }

    public void setMemoryTokenCount(String memoryTokenCount) {
        this.memoryTokenCount = memoryTokenCount;
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

    public String getPreviousResponseId() {
        return this.previousResponseId;
    }

    public void setPreviousResponseId(String previousResponseId) {
        this.previousResponseId = previousResponseId;
    }

    public String getProviderConversationId() {
        return this.providerConversationId;
    }

    public void setProviderConversationId(String providerConversationId) {
        this.providerConversationId = providerConversationId;
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

    public String getRuntimeInvocationId() {
        return this.runtimeInvocationId;
    }

    public void setRuntimeInvocationId(String runtimeInvocationId) {
        this.runtimeInvocationId = runtimeInvocationId;
    }

    public Integer getSnapshotNo() {
        return this.snapshotNo;
    }

    public void setSnapshotNo(Integer snapshotNo) {
        this.snapshotNo = snapshotNo;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStrategy() {
        return this.strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
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

    public String getTruncationReason() {
        return this.truncationReason;
    }

    public void setTruncationReason(String truncationReason) {
        this.truncationReason = truncationReason;
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
