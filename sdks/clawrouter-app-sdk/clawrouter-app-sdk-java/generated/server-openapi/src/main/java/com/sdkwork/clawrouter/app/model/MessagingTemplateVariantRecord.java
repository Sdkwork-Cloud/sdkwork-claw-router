package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class MessagingTemplateVariantRecord {
    private String bodyTemplate;
    private String channel;
    private String contentFormat;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String id;
    private Integer lengthLimit;
    private String locale;
    private Map<String, String> metadata;
    private String organizationId;
    private Map<String, String> providerPayloadSchema;
    private Map<String, String> renderOptions;
    private String status;
    private String templateVersionId;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public String getBodyTemplate() {
        return this.bodyTemplate;
    }

    public void setBodyTemplate(String bodyTemplate) {
        this.bodyTemplate = bodyTemplate;
    }

    public String getChannel() {
        return this.channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getContentFormat() {
        return this.contentFormat;
    }

    public void setContentFormat(String contentFormat) {
        this.contentFormat = contentFormat;
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

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLengthLimit() {
        return this.lengthLimit;
    }

    public void setLengthLimit(Integer lengthLimit) {
        this.lengthLimit = lengthLimit;
    }

    public String getLocale() {
        return this.locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
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

    public Map<String, String> getProviderPayloadSchema() {
        return this.providerPayloadSchema;
    }

    public void setProviderPayloadSchema(Map<String, String> providerPayloadSchema) {
        this.providerPayloadSchema = providerPayloadSchema;
    }

    public Map<String, String> getRenderOptions() {
        return this.renderOptions;
    }

    public void setRenderOptions(Map<String, String> renderOptions) {
        this.renderOptions = renderOptions;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTemplateVersionId() {
        return this.templateVersionId;
    }

    public void setTemplateVersionId(String templateVersionId) {
        this.templateVersionId = templateVersionId;
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
