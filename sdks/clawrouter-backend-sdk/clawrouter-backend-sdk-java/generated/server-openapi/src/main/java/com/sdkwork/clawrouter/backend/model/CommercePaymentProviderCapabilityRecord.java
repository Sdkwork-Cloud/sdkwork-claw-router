package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommercePaymentProviderCapabilityRecord {
    private String capabilityCode;
    private String countryCode;
    private String createdAt;
    private String currencyCode;
    private String effectiveFrom;
    private String effectiveTo;
    private String id;
    private String maxAmount;
    private Map<String, String> metadataJson;
    private String methodCode;
    private String minAmount;
    private Map<String, String> nativeOperationCodes;
    private String organizationId;
    private String providerAccountId;
    private String providerCode;
    private String sceneCode;
    private String status;
    private Map<String, String> supportedStatementTypes;
    private Map<String, String> supportedWebhookEvents;
    private String tenantId;
    private String updatedAt;

    public String getCapabilityCode() {
        return this.capabilityCode;
    }

    public void setCapabilityCode(String capabilityCode) {
        this.capabilityCode = capabilityCode;
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

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getEffectiveFrom() {
        return this.effectiveFrom;
    }

    public void setEffectiveFrom(String effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public String getEffectiveTo() {
        return this.effectiveTo;
    }

    public void setEffectiveTo(String effectiveTo) {
        this.effectiveTo = effectiveTo;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMaxAmount() {
        return this.maxAmount;
    }

    public void setMaxAmount(String maxAmount) {
        this.maxAmount = maxAmount;
    }

    public Map<String, String> getMetadataJson() {
        return this.metadataJson;
    }

    public void setMetadataJson(Map<String, String> metadataJson) {
        this.metadataJson = metadataJson;
    }

    public String getMethodCode() {
        return this.methodCode;
    }

    public void setMethodCode(String methodCode) {
        this.methodCode = methodCode;
    }

    public String getMinAmount() {
        return this.minAmount;
    }

    public void setMinAmount(String minAmount) {
        this.minAmount = minAmount;
    }

    public Map<String, String> getNativeOperationCodes() {
        return this.nativeOperationCodes;
    }

    public void setNativeOperationCodes(Map<String, String> nativeOperationCodes) {
        this.nativeOperationCodes = nativeOperationCodes;
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

    public String getSceneCode() {
        return this.sceneCode;
    }

    public void setSceneCode(String sceneCode) {
        this.sceneCode = sceneCode;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, String> getSupportedStatementTypes() {
        return this.supportedStatementTypes;
    }

    public void setSupportedStatementTypes(Map<String, String> supportedStatementTypes) {
        this.supportedStatementTypes = supportedStatementTypes;
    }

    public Map<String, String> getSupportedWebhookEvents() {
        return this.supportedWebhookEvents;
    }

    public void setSupportedWebhookEvents(Map<String, String> supportedWebhookEvents) {
        this.supportedWebhookEvents = supportedWebhookEvents;
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
}
