package com.sdkwork.clawrouter.backend.model;


public class AdminChannelCredentialItem {
    private String apiKey;
    private String baseUrl;
    private String credentialId;
    private Integer errors;
    private String id;
    private String maskedLabel;
    private String name;
    private Integer priority;
    private String secretRef;
    private String status;
    private Integer weight;

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

    public String getCredentialId() {
        return this.credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    public Integer getErrors() {
        return this.errors;
    }

    public void setErrors(Integer errors) {
        this.errors = errors;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMaskedLabel() {
        return this.maskedLabel;
    }

    public void setMaskedLabel(String maskedLabel) {
        this.maskedLabel = maskedLabel;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
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

    public Integer getWeight() {
        return this.weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
