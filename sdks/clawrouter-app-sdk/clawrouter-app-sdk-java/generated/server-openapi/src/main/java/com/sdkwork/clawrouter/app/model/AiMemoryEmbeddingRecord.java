package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiMemoryEmbeddingRecord {
    private String contentHash;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private Integer embeddingDimensions;
    private String embeddingModel;
    private String embeddingProvider;
    private String id;
    private String indexedAt;
    private String memoryId;
    private Map<String, String> metadata;
    private String organizationId;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private Map<String, String> vectorJson;
    private String vectorStorageKey;
    private String version;

    public String getContentHash() {
        return this.contentHash;
    }

    public void setContentHash(String contentHash) {
        this.contentHash = contentHash;
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

    public Integer getEmbeddingDimensions() {
        return this.embeddingDimensions;
    }

    public void setEmbeddingDimensions(Integer embeddingDimensions) {
        this.embeddingDimensions = embeddingDimensions;
    }

    public String getEmbeddingModel() {
        return this.embeddingModel;
    }

    public void setEmbeddingModel(String embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public String getEmbeddingProvider() {
        return this.embeddingProvider;
    }

    public void setEmbeddingProvider(String embeddingProvider) {
        this.embeddingProvider = embeddingProvider;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIndexedAt() {
        return this.indexedAt;
    }

    public void setIndexedAt(String indexedAt) {
        this.indexedAt = indexedAt;
    }

    public String getMemoryId() {
        return this.memoryId;
    }

    public void setMemoryId(String memoryId) {
        this.memoryId = memoryId;
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

    public Map<String, String> getVectorJson() {
        return this.vectorJson;
    }

    public void setVectorJson(Map<String, String> vectorJson) {
        this.vectorJson = vectorJson;
    }

    public String getVectorStorageKey() {
        return this.vectorStorageKey;
    }

    public void setVectorStorageKey(String vectorStorageKey) {
        this.vectorStorageKey = vectorStorageKey;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
