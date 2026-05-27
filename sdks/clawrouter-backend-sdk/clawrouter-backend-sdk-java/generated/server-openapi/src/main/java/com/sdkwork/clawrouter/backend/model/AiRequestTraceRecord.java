package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiRequestTraceRecord {
    private String apiKeyGroupId;
    private String apiKeyGroupSnapshot;
    private String apiKeyId;
    private String apiKeyNameSnapshot;
    private Integer attemptNo;
    private String cachedTokens;
    private String channelId;
    private String channelNameSnapshot;
    private String clientIpHash;
    private String clientIpMasked;
    private String clientIpRegion;
    private String completionTokens;
    private String createdAt;
    private String decisionLogId;
    private String endedAt;
    private String endpoint;
    private String errorMessageMasked;
    private String errorType;
    private String httpMethod;
    private Integer httpStatus;
    private String id;
    private Integer latencyMs;
    private String legacyApiKeyId;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String ownerId;
    private String ownerNameSnapshot;
    private String ownerType;
    private String payloadHash;
    private String promptTokens;
    private String providerAccountId;
    private String providerErrorCode;
    private String providerId;
    private String providerModel;
    private String providerNativeModel;
    private String reasoningEffort;
    private String requestBytes;
    private String requestId;
    private String requestPath;
    private String requestPayloadHash;
    private String requestedModel;
    private String requestedModelCatalogKey;
    private String responseBytes;
    private String responsePayloadHash;
    private String retentionUntil;
    private String startedAt;
    private String status;
    private Boolean streaming;
    private String tenantId;
    private String totalTokens;
    private String traceId;
    private Integer ttftMs;
    private String userAgentHash;
    private String userId;
    private String uuid;

    public String getApiKeyGroupId() {
        return this.apiKeyGroupId;
    }

    public void setApiKeyGroupId(String apiKeyGroupId) {
        this.apiKeyGroupId = apiKeyGroupId;
    }

    public String getApiKeyGroupSnapshot() {
        return this.apiKeyGroupSnapshot;
    }

    public void setApiKeyGroupSnapshot(String apiKeyGroupSnapshot) {
        this.apiKeyGroupSnapshot = apiKeyGroupSnapshot;
    }

    public String getApiKeyId() {
        return this.apiKeyId;
    }

    public void setApiKeyId(String apiKeyId) {
        this.apiKeyId = apiKeyId;
    }

    public String getApiKeyNameSnapshot() {
        return this.apiKeyNameSnapshot;
    }

    public void setApiKeyNameSnapshot(String apiKeyNameSnapshot) {
        this.apiKeyNameSnapshot = apiKeyNameSnapshot;
    }

    public Integer getAttemptNo() {
        return this.attemptNo;
    }

    public void setAttemptNo(Integer attemptNo) {
        this.attemptNo = attemptNo;
    }

    public String getCachedTokens() {
        return this.cachedTokens;
    }

    public void setCachedTokens(String cachedTokens) {
        this.cachedTokens = cachedTokens;
    }

    public String getChannelId() {
        return this.channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getChannelNameSnapshot() {
        return this.channelNameSnapshot;
    }

    public void setChannelNameSnapshot(String channelNameSnapshot) {
        this.channelNameSnapshot = channelNameSnapshot;
    }

    public String getClientIpHash() {
        return this.clientIpHash;
    }

    public void setClientIpHash(String clientIpHash) {
        this.clientIpHash = clientIpHash;
    }

    public String getClientIpMasked() {
        return this.clientIpMasked;
    }

    public void setClientIpMasked(String clientIpMasked) {
        this.clientIpMasked = clientIpMasked;
    }

    public String getClientIpRegion() {
        return this.clientIpRegion;
    }

    public void setClientIpRegion(String clientIpRegion) {
        this.clientIpRegion = clientIpRegion;
    }

    public String getCompletionTokens() {
        return this.completionTokens;
    }

    public void setCompletionTokens(String completionTokens) {
        this.completionTokens = completionTokens;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDecisionLogId() {
        return this.decisionLogId;
    }

    public void setDecisionLogId(String decisionLogId) {
        this.decisionLogId = decisionLogId;
    }

    public String getEndedAt() {
        return this.endedAt;
    }

    public void setEndedAt(String endedAt) {
        this.endedAt = endedAt;
    }

    public String getEndpoint() {
        return this.endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getErrorMessageMasked() {
        return this.errorMessageMasked;
    }

    public void setErrorMessageMasked(String errorMessageMasked) {
        this.errorMessageMasked = errorMessageMasked;
    }

    public String getErrorType() {
        return this.errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public String getHttpMethod() {
        return this.httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
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

    public String getLegacyApiKeyId() {
        return this.legacyApiKeyId;
    }

    public void setLegacyApiKeyId(String legacyApiKeyId) {
        this.legacyApiKeyId = legacyApiKeyId;
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

    public String getOwnerId() {
        return this.ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerNameSnapshot() {
        return this.ownerNameSnapshot;
    }

    public void setOwnerNameSnapshot(String ownerNameSnapshot) {
        this.ownerNameSnapshot = ownerNameSnapshot;
    }

    public String getOwnerType() {
        return this.ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public String getPayloadHash() {
        return this.payloadHash;
    }

    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getPromptTokens() {
        return this.promptTokens;
    }

    public void setPromptTokens(String promptTokens) {
        this.promptTokens = promptTokens;
    }

    public String getProviderAccountId() {
        return this.providerAccountId;
    }

    public void setProviderAccountId(String providerAccountId) {
        this.providerAccountId = providerAccountId;
    }

    public String getProviderErrorCode() {
        return this.providerErrorCode;
    }

    public void setProviderErrorCode(String providerErrorCode) {
        this.providerErrorCode = providerErrorCode;
    }

    public String getProviderId() {
        return this.providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getProviderModel() {
        return this.providerModel;
    }

    public void setProviderModel(String providerModel) {
        this.providerModel = providerModel;
    }

    public String getProviderNativeModel() {
        return this.providerNativeModel;
    }

    public void setProviderNativeModel(String providerNativeModel) {
        this.providerNativeModel = providerNativeModel;
    }

    public String getReasoningEffort() {
        return this.reasoningEffort;
    }

    public void setReasoningEffort(String reasoningEffort) {
        this.reasoningEffort = reasoningEffort;
    }

    public String getRequestBytes() {
        return this.requestBytes;
    }

    public void setRequestBytes(String requestBytes) {
        this.requestBytes = requestBytes;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRequestPath() {
        return this.requestPath;
    }

    public void setRequestPath(String requestPath) {
        this.requestPath = requestPath;
    }

    public String getRequestPayloadHash() {
        return this.requestPayloadHash;
    }

    public void setRequestPayloadHash(String requestPayloadHash) {
        this.requestPayloadHash = requestPayloadHash;
    }

    public String getRequestedModel() {
        return this.requestedModel;
    }

    public void setRequestedModel(String requestedModel) {
        this.requestedModel = requestedModel;
    }

    public String getRequestedModelCatalogKey() {
        return this.requestedModelCatalogKey;
    }

    public void setRequestedModelCatalogKey(String requestedModelCatalogKey) {
        this.requestedModelCatalogKey = requestedModelCatalogKey;
    }

    public String getResponseBytes() {
        return this.responseBytes;
    }

    public void setResponseBytes(String responseBytes) {
        this.responseBytes = responseBytes;
    }

    public String getResponsePayloadHash() {
        return this.responsePayloadHash;
    }

    public void setResponsePayloadHash(String responsePayloadHash) {
        this.responsePayloadHash = responsePayloadHash;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }

    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getStreaming() {
        return this.streaming;
    }

    public void setStreaming(Boolean streaming) {
        this.streaming = streaming;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTotalTokens() {
        return this.totalTokens;
    }

    public void setTotalTokens(String totalTokens) {
        this.totalTokens = totalTokens;
    }

    public String getTraceId() {
        return this.traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public Integer getTtftMs() {
        return this.ttftMs;
    }

    public void setTtftMs(Integer ttftMs) {
        this.ttftMs = ttftMs;
    }

    public String getUserAgentHash() {
        return this.userAgentHash;
    }

    public void setUserAgentHash(String userAgentHash) {
        this.userAgentHash = userAgentHash;
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
