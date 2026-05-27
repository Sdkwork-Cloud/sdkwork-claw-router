package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiGenerationSessionRecord {
    private String activeModality;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private Map<String, String> filterConfig;
    private String id;
    private String lastOpenedAt;
    private String lastPrompt;
    private Map<String, String> metadata;
    private String organizationId;
    private String ownerId;
    private String ownerType;
    private Map<String, String> selectedModels;
    private String sessionCode;
    private String status;
    private String tenantId;
    private String title;
    private String updatedAt;
    private String userId;
    private String uuid;
    private String version;

    public String getActiveModality() {
        return this.activeModality;
    }

    public void setActiveModality(String activeModality) {
        this.activeModality = activeModality;
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

    public Map<String, String> getFilterConfig() {
        return this.filterConfig;
    }

    public void setFilterConfig(Map<String, String> filterConfig) {
        this.filterConfig = filterConfig;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastOpenedAt() {
        return this.lastOpenedAt;
    }

    public void setLastOpenedAt(String lastOpenedAt) {
        this.lastOpenedAt = lastOpenedAt;
    }

    public String getLastPrompt() {
        return this.lastPrompt;
    }

    public void setLastPrompt(String lastPrompt) {
        this.lastPrompt = lastPrompt;
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

    public String getOwnerType() {
        return this.ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public Map<String, String> getSelectedModels() {
        return this.selectedModels;
    }

    public void setSelectedModels(Map<String, String> selectedModels) {
        this.selectedModels = selectedModels;
    }

    public String getSessionCode() {
        return this.sessionCode;
    }

    public void setSessionCode(String sessionCode) {
        this.sessionCode = sessionCode;
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

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
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

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
