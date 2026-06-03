package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSiteModelItem {
    private List<String> capabilities;
    private Integer consecutiveErrorCount;
    private Integer contextTokens;
    private String displayName;
    private String healthStatus;
    private String id;
    private Integer lastLatencyMs;
    private String lastSyncAt;
    private Integer maxInputTokens;
    private Integer maxOutputTokens;
    private String modality;
    private String modelCode;
    private String modelName;
    private String providerModel;
    private String providerNativeModel;
    private String serviceType;
    private String siteCode;
    private String siteId;
    private String siteServiceCode;
    private String siteServiceId;
    private String status;
    private Boolean supportsJsonSchema;
    private Boolean supportsStreaming;
    private Boolean supportsTools;
    private String vendorCode;

    public List<String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public Integer getConsecutiveErrorCount() {
        return this.consecutiveErrorCount;
    }

    public void setConsecutiveErrorCount(Integer consecutiveErrorCount) {
        this.consecutiveErrorCount = consecutiveErrorCount;
    }

    public Integer getContextTokens() {
        return this.contextTokens;
    }

    public void setContextTokens(Integer contextTokens) {
        this.contextTokens = contextTokens;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
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

    public Integer getLastLatencyMs() {
        return this.lastLatencyMs;
    }

    public void setLastLatencyMs(Integer lastLatencyMs) {
        this.lastLatencyMs = lastLatencyMs;
    }

    public String getLastSyncAt() {
        return this.lastSyncAt;
    }

    public void setLastSyncAt(String lastSyncAt) {
        this.lastSyncAt = lastSyncAt;
    }

    public Integer getMaxInputTokens() {
        return this.maxInputTokens;
    }

    public void setMaxInputTokens(Integer maxInputTokens) {
        this.maxInputTokens = maxInputTokens;
    }

    public Integer getMaxOutputTokens() {
        return this.maxOutputTokens;
    }

    public void setMaxOutputTokens(Integer maxOutputTokens) {
        this.maxOutputTokens = maxOutputTokens;
    }

    public String getModality() {
        return this.modality;
    }

    public void setModality(String modality) {
        this.modality = modality;
    }

    public String getModelCode() {
        return this.modelCode;
    }

    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
    }

    public String getModelName() {
        return this.modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getProviderModel() {
        return this.providerModel;
    }

    public void setProviderModel(String providerModel) {
        this.providerModel = providerModel;
    }

    public String getProviderNativeModel() {
        return this.providerNativeModel;
    }

    public void setProviderNativeModel(String providerNativeModel) {
        this.providerNativeModel = providerNativeModel;
    }

    public String getServiceType() {
        return this.serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getSiteCode() {
        return this.siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public String getSiteId() {
        return this.siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public String getSiteServiceCode() {
        return this.siteServiceCode;
    }

    public void setSiteServiceCode(String siteServiceCode) {
        this.siteServiceCode = siteServiceCode;
    }

    public String getSiteServiceId() {
        return this.siteServiceId;
    }

    public void setSiteServiceId(String siteServiceId) {
        this.siteServiceId = siteServiceId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getSupportsJsonSchema() {
        return this.supportsJsonSchema;
    }

    public void setSupportsJsonSchema(Boolean supportsJsonSchema) {
        this.supportsJsonSchema = supportsJsonSchema;
    }

    public Boolean getSupportsStreaming() {
        return this.supportsStreaming;
    }

    public void setSupportsStreaming(Boolean supportsStreaming) {
        this.supportsStreaming = supportsStreaming;
    }

    public Boolean getSupportsTools() {
        return this.supportsTools;
    }

    public void setSupportsTools(Boolean supportsTools) {
        this.supportsTools = supportsTools;
    }

    public String getVendorCode() {
        return this.vendorCode;
    }

    public void setVendorCode(String vendorCode) {
        this.vendorCode = vendorCode;
    }
}
