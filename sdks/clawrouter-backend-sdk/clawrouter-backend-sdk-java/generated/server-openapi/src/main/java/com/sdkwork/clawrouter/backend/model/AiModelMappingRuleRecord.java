package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiModelMappingRuleRecord {
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private Boolean enabled;
    private String id;
    private String mappingMode;
    private String matchType;
    private Map<String, String> metadata;
    private String organizationId;
    private String sourceVendorCode;
    private String sourceVendorId;
    private String status;
    private String targetVendorCode;
    private String targetVendorId;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

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

    public Boolean getEnabled() {
        return this.enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMappingMode() {
        return this.mappingMode;
    }

    public void setMappingMode(String mappingMode) {
        this.mappingMode = mappingMode;
    }

    public String getMatchType() {
        return this.matchType;
    }

    public void setMatchType(String matchType) {
        this.matchType = matchType;
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

    public String getSourceVendorCode() {
        return this.sourceVendorCode;
    }

    public void setSourceVendorCode(String sourceVendorCode) {
        this.sourceVendorCode = sourceVendorCode;
    }

    public String getSourceVendorId() {
        return this.sourceVendorId;
    }

    public void setSourceVendorId(String sourceVendorId) {
        this.sourceVendorId = sourceVendorId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetVendorCode() {
        return this.targetVendorCode;
    }

    public void setTargetVendorCode(String targetVendorCode) {
        this.targetVendorCode = targetVendorCode;
    }

    public String getTargetVendorId() {
        return this.targetVendorId;
    }

    public void setTargetVendorId(String targetVendorId) {
        this.targetVendorId = targetVendorId;
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
