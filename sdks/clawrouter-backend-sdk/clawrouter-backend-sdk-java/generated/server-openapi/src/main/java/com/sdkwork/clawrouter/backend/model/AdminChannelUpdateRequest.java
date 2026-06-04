package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminChannelUpdateRequest {
    private String accessType;
    private List<String> capabilities;
    private String channelType;
    private ProviderCircuitBreakerPolicy circuitBreakerPolicy;
    private String credentialRotation;
    private List<AdminChannelCredentialInput> credentials;
    private String expiresAt;
    private String id;
    private List<String> models;
    private String name;
    private String protocol;
    private List<String> resourceCodes;
    private ProviderRetryPolicy retryPolicy;
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

    public String getCredentialRotation() {
        return this.credentialRotation;
    }

    public void setCredentialRotation(String credentialRotation) {
        this.credentialRotation = credentialRotation;
    }

    public List<AdminChannelCredentialInput> getCredentials() {
        return this.credentials;
    }

    public void setCredentials(List<AdminChannelCredentialInput> credentials) {
        this.credentials = credentials;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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
