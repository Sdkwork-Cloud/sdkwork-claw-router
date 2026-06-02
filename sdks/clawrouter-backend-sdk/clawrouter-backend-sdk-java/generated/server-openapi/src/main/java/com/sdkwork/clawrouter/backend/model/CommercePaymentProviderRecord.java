package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommercePaymentProviderRecord {
    private String createdAt;
    private String displayName;
    private String id;
    private String organizationId;
    private String providerCode;
    private String providerType;
    private String sortOrder;
    private String status;
    private Map<String, String> supportedCountries;
    private Map<String, String> supportedCurrencies;
    private Map<String, String> supportedMethods;
    private String tenantId;
    private String updatedAt;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
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

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getProviderType() {
        return this.providerType;
    }

    public void setProviderType(String providerType) {
        this.providerType = providerType;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, String> getSupportedCountries() {
        return this.supportedCountries;
    }

    public void setSupportedCountries(Map<String, String> supportedCountries) {
        this.supportedCountries = supportedCountries;
    }

    public Map<String, String> getSupportedCurrencies() {
        return this.supportedCurrencies;
    }

    public void setSupportedCurrencies(Map<String, String> supportedCurrencies) {
        this.supportedCurrencies = supportedCurrencies;
    }

    public Map<String, String> getSupportedMethods() {
        return this.supportedMethods;
    }

    public void setSupportedMethods(Map<String, String> supportedMethods) {
        this.supportedMethods = supportedMethods;
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
