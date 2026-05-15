package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class IamGatewayAccessPolicyRecord {
    private Map<String, String> allowedCapabilities;
    private Map<String, String> allowedModels;
    private String createdAt;
    private String dataRetentionMode;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private Map<String, String> deniedCapabilities;
    private Map<String, String> deniedModels;
    private String effectiveFrom;
    private String effectiveTo;
    private String id;
    private Map<String, String> ipAllowlist;
    private Map<String, String> ipDenylist;
    private Integer ipRuleCount;
    private String maxContextTokens;
    private Map<String, String> metadata;
    private String name;
    private String networkPolicyMode;
    private String organizationId;
    private String policyType;
    private Map<String, String> regionAllowlist;
    private String status;
    private String subjectId;
    private String subjectRefHash;
    private String subjectRefMasked;
    private String subjectType;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public Map<String, String> getAllowedCapabilities() {
        return this.allowedCapabilities;
    }
    
    public void setAllowedCapabilities(Map<String, String> allowedCapabilities) {
        this.allowedCapabilities = allowedCapabilities;
    }

    public Map<String, String> getAllowedModels() {
        return this.allowedModels;
    }
    
    public void setAllowedModels(Map<String, String> allowedModels) {
        this.allowedModels = allowedModels;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDataRetentionMode() {
        return this.dataRetentionMode;
    }
    
    public void setDataRetentionMode(String dataRetentionMode) {
        this.dataRetentionMode = dataRetentionMode;
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

    public Map<String, String> getDeniedCapabilities() {
        return this.deniedCapabilities;
    }
    
    public void setDeniedCapabilities(Map<String, String> deniedCapabilities) {
        this.deniedCapabilities = deniedCapabilities;
    }

    public Map<String, String> getDeniedModels() {
        return this.deniedModels;
    }
    
    public void setDeniedModels(Map<String, String> deniedModels) {
        this.deniedModels = deniedModels;
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

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getIpAllowlist() {
        return this.ipAllowlist;
    }
    
    public void setIpAllowlist(Map<String, String> ipAllowlist) {
        this.ipAllowlist = ipAllowlist;
    }

    public Map<String, String> getIpDenylist() {
        return this.ipDenylist;
    }
    
    public void setIpDenylist(Map<String, String> ipDenylist) {
        this.ipDenylist = ipDenylist;
    }

    public Integer getIpRuleCount() {
        return this.ipRuleCount;
    }
    
    public void setIpRuleCount(Integer ipRuleCount) {
        this.ipRuleCount = ipRuleCount;
    }

    public String getMaxContextTokens() {
        return this.maxContextTokens;
    }
    
    public void setMaxContextTokens(String maxContextTokens) {
        this.maxContextTokens = maxContextTokens;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getNetworkPolicyMode() {
        return this.networkPolicyMode;
    }
    
    public void setNetworkPolicyMode(String networkPolicyMode) {
        this.networkPolicyMode = networkPolicyMode;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPolicyType() {
        return this.policyType;
    }
    
    public void setPolicyType(String policyType) {
        this.policyType = policyType;
    }

    public Map<String, String> getRegionAllowlist() {
        return this.regionAllowlist;
    }
    
    public void setRegionAllowlist(Map<String, String> regionAllowlist) {
        this.regionAllowlist = regionAllowlist;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubjectId() {
        return this.subjectId;
    }
    
    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectRefHash() {
        return this.subjectRefHash;
    }
    
    public void setSubjectRefHash(String subjectRefHash) {
        this.subjectRefHash = subjectRefHash;
    }

    public String getSubjectRefMasked() {
        return this.subjectRefMasked;
    }
    
    public void setSubjectRefMasked(String subjectRefMasked) {
        this.subjectRefMasked = subjectRefMasked;
    }

    public String getSubjectType() {
        return this.subjectType;
    }
    
    public void setSubjectType(String subjectType) {
        this.subjectType = subjectType;
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
