package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminChannelCreateRequest {
    private String accessType;
    private String apiKey;
    private String baseUrl;
    private List<String> capabilities;
    private String channelType;
    private ProviderCircuitBreakerPolicy circuitBreakerPolicy;
    private String expiresAt;
    private List<String> models;
    private String name;
    private String protocol;
    private List<String> resourceCodes;
    private ProviderRetryPolicy retryPolicy;
    private String secretRef;
    private String status;
    private Integer timeoutMs;
    private String vendor;
    private Integer weight;

    public String getAccessType() {
        return this.accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public String getApiKey() {
        return this.apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getBaseUrl() {
        return this.baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public List<String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getChannelType() {
        return this.channelType;
    }

    public void setChannelType(String channelType) {
        this.channelType = channelType;
    }

    public ProviderCircuitBreakerPolicy getCircuitBreakerPolicy() {
        return this.circuitBreakerPolicy;
    }

    public void setCircuitBreakerPolicy(ProviderCircuitBreakerPolicy circuitBreakerPolicy) {
        this.circuitBreakerPolicy = circuitBreakerPolicy;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public List<String> getModels() {
        return this.models;
    }

    public void setModels(List<String> models) {
        this.models = models;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProtocol() {
        return this.protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public List<String> getResourceCodes() {
        return this.resourceCodes;
    }

    public void setResourceCodes(List<String> resourceCodes) {
        this.resourceCodes = resourceCodes;
    }

    public ProviderRetryPolicy getRetryPolicy() {
        return this.retryPolicy;
    }

    public void setRetryPolicy(ProviderRetryPolicy retryPolicy) {
        this.retryPolicy = retryPolicy;
    }

    public String getSecretRef() {
        return this.secretRef;
    }

    public void setSecretRef(String secretRef) {
        this.secretRef = secretRef;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTimeoutMs() {
        return this.timeoutMs;
    }

    public void setTimeoutMs(Integer timeoutMs) {
        this.timeoutMs = timeoutMs;
    }

    public String getVendor() {
        return this.vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public Integer getWeight() {
        return this.weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
