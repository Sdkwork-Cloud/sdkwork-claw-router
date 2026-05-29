package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiModalityRecord {
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String description;
    private String displayName;
    private String id;
    private Boolean inputSupported;
    private Map<String, String> metadata;
    private String modalityCode;
    private String modalityGroup;
    private String organizationId;
    private Boolean outputSupported;
    private Integer sortOrder;
    private String status;
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

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getInputSupported() {
        return this.inputSupported;
    }

    public void setInputSupported(Boolean inputSupported) {
        this.inputSupported = inputSupported;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getModalityCode() {
        return this.modalityCode;
    }

    public void setModalityCode(String modalityCode) {
        this.modalityCode = modalityCode;
    }

    public String getModalityGroup() {
        return this.modalityGroup;
    }

    public void setModalityGroup(String modalityGroup) {
        this.modalityGroup = modalityGroup;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Boolean getOutputSupported() {
        return this.outputSupported;
    }

    public void setOutputSupported(Boolean outputSupported) {
        this.outputSupported = outputSupported;
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
