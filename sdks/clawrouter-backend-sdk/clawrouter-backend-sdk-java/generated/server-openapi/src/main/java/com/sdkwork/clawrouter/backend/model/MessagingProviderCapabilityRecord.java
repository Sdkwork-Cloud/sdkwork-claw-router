package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class MessagingProviderCapabilityRecord {
    private Map<String, String> capabilitySchema;
    private String channel;
    private String countryCode;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String deliveryPurpose;
    private String healthStatus;
    private String id;
    private String lastVerifiedAt;
    private String locale;
    private Map<String, String> metadata;
    private String organizationId;
    private String providerAccountId;
    private String providerCode;
    private Map<String, String> rateLimitPolicy;
    private Boolean sandboxSupported;
    private String status;
    private Boolean supportsBatchSend;
    private Boolean supportsDeliveryReceipt;
    private Boolean supportsTemplateSync;
    private Boolean supportsTestSend;
    private Boolean supportsWebhook;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public Map<String, String> getCapabilitySchema() {
        return this.capabilitySchema;
    }

    public void setCapabilitySchema(Map<String, String> capabilitySchema) {
        this.capabilitySchema = capabilitySchema;
    }

    public String getChannel() {
        return this.channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getCountryCode() {
        return this.countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
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

    public String getDeliveryPurpose() {
        return this.deliveryPurpose;
    }

    public void setDeliveryPurpose(String deliveryPurpose) {
        this.deliveryPurpose = deliveryPurpose;
    }

    public String getHealthStatus() {
        return this.healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastVerifiedAt() {
        return this.lastVerifiedAt;
    }

    public void setLastVerifiedAt(String lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
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

    public String getProviderAccountId() {
        return this.providerAccountId;
    }

    public void setProviderAccountId(String providerAccountId) {
        this.providerAccountId = providerAccountId;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public Map<String, String> getRateLimitPolicy() {
        return this.rateLimitPolicy;
    }

    public void setRateLimitPolicy(Map<String, String> rateLimitPolicy) {
        this.rateLimitPolicy = rateLimitPolicy;
    }

    public Boolean getSandboxSupported() {
        return this.sandboxSupported;
    }

    public void setSandboxSupported(Boolean sandboxSupported) {
        this.sandboxSupported = sandboxSupported;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getSupportsBatchSend() {
        return this.supportsBatchSend;
    }

    public void setSupportsBatchSend(Boolean supportsBatchSend) {
        this.supportsBatchSend = supportsBatchSend;
    }

    public Boolean getSupportsDeliveryReceipt() {
        return this.supportsDeliveryReceipt;
    }

    public void setSupportsDeliveryReceipt(Boolean supportsDeliveryReceipt) {
        this.supportsDeliveryReceipt = supportsDeliveryReceipt;
    }

    public Boolean getSupportsTemplateSync() {
        return this.supportsTemplateSync;
    }

    public void setSupportsTemplateSync(Boolean supportsTemplateSync) {
        this.supportsTemplateSync = supportsTemplateSync;
    }

    public Boolean getSupportsTestSend() {
        return this.supportsTestSend;
    }

    public void setSupportsTestSend(Boolean supportsTestSend) {
        this.supportsTestSend = supportsTestSend;
    }

    public Boolean getSupportsWebhook() {
        return this.supportsWebhook;
    }

    public void setSupportsWebhook(Boolean supportsWebhook) {
        this.supportsWebhook = supportsWebhook;
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
