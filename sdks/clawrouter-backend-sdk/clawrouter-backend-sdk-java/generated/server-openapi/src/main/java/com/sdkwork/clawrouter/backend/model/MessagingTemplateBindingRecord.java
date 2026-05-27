package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class MessagingTemplateBindingRecord {
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String id;
    private String lastSyncedAt;
    private Map<String, String> metadata;
    private String organizationId;
    private String providerTemplateVersion;
    private String rejectionReason;
    private String status;
    private String syncPayloadHash;
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

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastSyncedAt() {
        return this.lastSyncedAt;
    }

    public void setLastSyncedAt(String lastSyncedAt) {
        this.lastSyncedAt = lastSyncedAt;
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

    public String getProviderTemplateVersion() {
        return this.providerTemplateVersion;
    }

    public void setProviderTemplateVersion(String providerTemplateVersion) {
        this.providerTemplateVersion = providerTemplateVersion;
    }

    public String getRejectionReason() {
        return this.rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSyncPayloadHash() {
        return this.syncPayloadHash;
    }

    public void setSyncPayloadHash(String syncPayloadHash) {
        this.syncPayloadHash = syncPayloadHash;
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
