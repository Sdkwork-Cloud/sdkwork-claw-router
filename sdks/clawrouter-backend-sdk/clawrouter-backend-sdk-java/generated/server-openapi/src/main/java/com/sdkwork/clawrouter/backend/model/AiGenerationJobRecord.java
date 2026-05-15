package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiGenerationJobRecord {
    private String channelId;
    private String completedAt;
    private String createdAt;
    private String failureCode;
    private String failureMessageMasked;
    private String id;
    private Map<String, String> inputAssetIds;
    private String jobType;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String modality;
    private String model;
    private String negativePrompt;
    private String organizationId;
    private Map<String, String> parameterSnapshot;
    private String payloadHash;
    private Integer progressPercent;
    private String prompt;
    private String providerId;
    private String requestId;
    private String retentionUntil;
    private String sessionId;
    private String startedAt;
    private String status;
    private String tenantId;
    private String traceId;
    private String usageFactId;
    private String userId;
    private String uuid;

    public String getChannelId() {
        return this.channelId;
    }
    
    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getCompletedAt() {
        return this.completedAt;
    }
    
    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
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

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getInputAssetIds() {
        return this.inputAssetIds;
    }
    
    public void setInputAssetIds(Map<String, String> inputAssetIds) {
        this.inputAssetIds = inputAssetIds;
    }

    public String getJobType() {
        return this.jobType;
    }
    
    public void setJobType(String jobType) {
        this.jobType = jobType;
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

    public String getModality() {
        return this.modality;
    }
    
    public void setModality(String modality) {
        this.modality = modality;
    }

    public String getModel() {
        return this.model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }

    public String getNegativePrompt() {
        return this.negativePrompt;
    }
    
    public void setNegativePrompt(String negativePrompt) {
        this.negativePrompt = negativePrompt;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getParameterSnapshot() {
        return this.parameterSnapshot;
    }
    
    public void setParameterSnapshot(Map<String, String> parameterSnapshot) {
        this.parameterSnapshot = parameterSnapshot;
    }

    public String getPayloadHash() {
        return this.payloadHash;
    }
    
    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public Integer getProgressPercent() {
        return this.progressPercent;
    }
    
    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public String getPrompt() {
        return this.prompt;
    }
    
    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getProviderId() {
        return this.providerId;
    }
    
    public void setProviderId(String providerId) {
        this.providerId = providerId;
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

    public String getSessionId() {
        return this.sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
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
