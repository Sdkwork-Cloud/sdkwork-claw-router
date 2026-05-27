package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class OpenPlatformManifestRecord {
    private String accountType;
    private Map<String, String> callbackSchema;
    private Map<String, String> capabilitySchema;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private Map<String, String> entrySchema;
    private String id;
    private String manifestKey;
    private Map<String, String> metadata;
    private String organizationId;
    private String provider;
    private Integer sortOrder;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public String getAccountType() {
        return this.accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public Map<String, String> getCallbackSchema() {
        return this.callbackSchema;
    }

    public void setCallbackSchema(Map<String, String> callbackSchema) {
        this.callbackSchema = callbackSchema;
    }

    public Map<String, String> getCapabilitySchema() {
        return this.capabilitySchema;
    }

    public void setCapabilitySchema(Map<String, String> capabilitySchema) {
        this.capabilitySchema = capabilitySchema;
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

    public Map<String, String> getEntrySchema() {
        return this.entrySchema;
    }

    public void setEntrySchema(Map<String, String> entrySchema) {
        this.entrySchema = entrySchema;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getManifestKey() {
        return this.manifestKey;
    }

    public void setManifestKey(String manifestKey) {
        this.manifestKey = manifestKey;
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

    public String getProvider() {
        return this.provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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
