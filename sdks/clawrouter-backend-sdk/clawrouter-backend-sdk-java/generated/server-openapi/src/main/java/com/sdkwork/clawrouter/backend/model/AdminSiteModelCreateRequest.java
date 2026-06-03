package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSiteModelCreateRequest {
    private List<String> capabilities;
    private Integer contextTokens;
    private String displayName;
    private Integer maxInputTokens;
    private Integer maxOutputTokens;
    private String modality;
    private String modelCode;
    private String modelName;
    private String providerModel;
    private String providerNativeModel;
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
