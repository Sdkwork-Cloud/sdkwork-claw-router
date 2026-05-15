package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiRoutingRuleRecord {
    private Map<String, String> candidateChannels;
    private Map<String, String> constraints;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String effectiveFrom;
    private String effectiveTo;
    private Map<String, String> fallbackChain;
    private String id;
    private Map<String, String> matchExpression;
    private Map<String, String> metadata;
    private String organizationId;
    private Integer priority;
    private String profileId;
    private String rateLimitPolicyId;
    private String ruleCode;
    private String status;
    private String targetModel;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public Map<String, String> getCandidateChannels() {
        return this.candidateChannels;
    }
    
    public void setCandidateChannels(Map<String, String> candidateChannels) {
        this.candidateChannels = candidateChannels;
    }

    public Map<String, String> getConstraints() {
        return this.constraints;
    }
    
    public void setConstraints(Map<String, String> constraints) {
        this.constraints = constraints;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDataScope() {
        return this.dataScope;
    }
    
    public void setDataScope(String dataScope) {
        this.dataScope = dataScope;
    }

    public String getDeletedAt() {
        return this.deletedAt;
    }
    
    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getDeletedBy() {
        return this.deletedBy;
    }
    
    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public String getEffectiveFrom() {
        return this.effectiveFrom;
    }
    
    public void setEffectiveFrom(String effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public String getEffectiveTo() {
        return this.effectiveTo;
    }
    
    public void setEffectiveTo(String effectiveTo) {
        this.effectiveTo = effectiveTo;
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

    public Map<String, String> getMatchExpression() {
        return this.matchExpression;
    }
    
    public void setMatchExpression(Map<String, String> matchExpression) {
        this.matchExpression = matchExpression;
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

    public Integer getPriority() {
        return this.priority;
    }
    
    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getProfileId() {
        return this.profileId;
    }
    
    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    public String getRateLimitPolicyId() {
        return this.rateLimitPolicyId;
    }
    
    public void setRateLimitPolicyId(String rateLimitPolicyId) {
        this.rateLimitPolicyId = rateLimitPolicyId;
    }

    public String getRuleCode() {
        return this.ruleCode;
    }
    
    public void setRuleCode(String ruleCode) {
        this.ruleCode = ruleCode;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetModel() {
        return this.targetModel;
    }
    
    public void setTargetModel(String targetModel) {
        this.targetModel = targetModel;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUuid() {
        return this.uuid;
    }
    
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getVersion() {
        return this.version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
}
