package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiModelModalityRecord {
    private String catalogKey;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String direction;
    private String id;
    private Map<String, String> metadata;
    private String modalityCode;
    private String modalityId;
    private String model;
    private String modelId;
    private String organizationId;
    private Integer sortOrder;
    private String status;
    private Boolean supported;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String vendorCode;
    private String version;

    public String getCatalogKey() {
        return this.catalogKey;
    }

    public void setCatalogKey(String catalogKey) {
        this.catalogKey = catalogKey;
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

    public String getDirection() {
        return this.direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getModalityId() {
        return this.modalityId;
    }

    public void setModalityId(String modalityId) {
        this.modalityId = modalityId;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getModelId() {
        return this.modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
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

    public Boolean getSupported() {
        return this.supported;
    }

    public void setSupported(Boolean supported) {
        this.supported = supported;
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

    public String getVendorCode() {
        return this.vendorCode;
    }

    public void setVendorCode(String vendorCode) {
        this.vendorCode = vendorCode;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
