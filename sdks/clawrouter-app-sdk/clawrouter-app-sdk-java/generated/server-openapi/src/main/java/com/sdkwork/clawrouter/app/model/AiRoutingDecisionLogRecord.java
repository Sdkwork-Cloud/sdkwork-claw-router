package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiRoutingDecisionLogRecord {
    private String apiKeyId;
    private Map<String, String> candidateSnapshot;
    private String capability;
    private String createdAt;
    private Integer decisionLatencyMs;
    private String decisionMode;
    private Map<String, String> decisionReason;
    private Map<String, String> fallbackChain;
    private String id;
    private String legacyApiKeyId;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String policyId;
    private String profileId;
    private String requestId;
    private String requestedModel;
    private String resolvedModel;
    private String retentionUntil;
    private String ruleId;
    private String selectedAccountId;
    private String selectedChannelId;
    private String selectedProviderId;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getApiKeyId() {
        return this.apiKeyId;
    }
    
    public void setApiKeyId(String apiKeyId) {
        this.apiKeyId = apiKeyId;
    }

    public Map<String, String> getCandidateSnapshot() {
        return this.candidateSnapshot;
    }
    
    public void setCandidateSnapshot(Map<String, String> candidateSnapshot) {
        this.candidateSnapshot = candidateSnapshot;
    }

    public String getCapability() {
        return this.capability;
    }
    
    public void setCapability(String capability) {
        this.capability = capability;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getDecisionLatencyMs() {
        return this.decisionLatencyMs;
    }
    
    public void setDecisionLatencyMs(Integer decisionLatencyMs) {
        this.decisionLatencyMs = decisionLatencyMs;
    }

    public String getDecisionMode() {
        return this.decisionMode;
    }
    
    public void setDecisionMode(String decisionMode) {
        this.decisionMode = decisionMode;
    }

    public Map<String, String> getDecisionReason() {
        return this.decisionReason;
    }
    
    public void setDecisionReason(Map<String, String> decisionReason) {
        this.decisionReason = decisionReason;
    }

    public Map<String, String> getFallbackChain() {
        return this.fallbackChain;
    }
    
    public void setFallbackChain(Map<String, String> fallbackChain) {
        this.fallbackChain = fallbackChain;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
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

    public String getPayloadHash() {
        return this.payloadHash;
    }
    
    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getPolicyId() {
        return this.policyId;
    }
    
    public void setPolicyId(String policyId) {
        this.policyId = policyId;
    }

    public String getProfileId() {
        return this.profileId;
    }
    
    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    public String getRequestId() {
        return this.requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRequestedModel() {
        return this.requestedModel;
    }
    
    public void setRequestedModel(String requestedModel) {
        this.requestedModel = requestedModel;
    }

    public String getResolvedModel() {
        return this.resolvedModel;
    }
    
    public void setResolvedModel(String resolvedModel) {
        this.resolvedModel = resolvedModel;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }
    
    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getRuleId() {
        return this.ruleId;
    }
    
    public void setRuleId(String ruleId) {
        this.ruleId = ruleId;
    }

    public String getSelectedAccountId() {
        return this.selectedAccountId;
    }
    
    public void setSelectedAccountId(String selectedAccountId) {
        this.selectedAccountId = selectedAccountId;
    }

    public String getSelectedChannelId() {
        return this.selectedChannelId;
    }
    
    public void setSelectedChannelId(String selectedChannelId) {
        this.selectedChannelId = selectedChannelId;
    }

    public String getSelectedProviderId() {
        return this.selectedProviderId;
    }
    
    public void setSelectedProviderId(String selectedProviderId) {
        this.selectedProviderId = selectedProviderId;
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
