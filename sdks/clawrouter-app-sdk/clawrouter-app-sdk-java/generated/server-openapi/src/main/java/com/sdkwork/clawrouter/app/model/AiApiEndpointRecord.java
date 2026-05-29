package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiApiEndpointRecord {
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String displayName;
    private String endpointCode;
    private String id;
    private Map<String, String> metadata;
    private String method;
    private String organizationId;
    private String pathTemplate;
    private String protocolCode;
    private Map<String, String> requestSchema;
    private Map<String, String> responseSchema;
    private Integer sortOrder;
    private String status;
    private Boolean streamingSupported;
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

    public String getDisplayName() {
        return this.displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEndpointCode() {
        return this.endpointCode;
    }

    public void setEndpointCode(String endpointCode) {
        this.endpointCode = endpointCode;
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

    public String getMethod() {
        return this.method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPathTemplate() {
        return this.pathTemplate;
    }

    public void setPathTemplate(String pathTemplate) {
        this.pathTemplate = pathTemplate;
    }

    public String getProtocolCode() {
        return this.protocolCode;
    }

    public void setProtocolCode(String protocolCode) {
        this.protocolCode = protocolCode;
    }

    public Map<String, String> getRequestSchema() {
        return this.requestSchema;
    }

    public void setRequestSchema(Map<String, String> requestSchema) {
        this.requestSchema = requestSchema;
    }

    public Map<String, String> getResponseSchema() {
        return this.responseSchema;
    }

    public void setResponseSchema(Map<String, String> responseSchema) {
        this.responseSchema = responseSchema;
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

    public Boolean getStreamingSupported() {
        return this.streamingSupported;
    }

    public void setStreamingSupported(Boolean streamingSupported) {
        this.streamingSupported = streamingSupported;
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
