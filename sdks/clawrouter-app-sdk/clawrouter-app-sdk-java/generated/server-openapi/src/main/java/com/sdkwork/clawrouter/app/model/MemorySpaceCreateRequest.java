package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class MemorySpaceCreateRequest {
    private Boolean autoExtractEnabled;
    private Boolean autoRecallEnabled;
    private Integer maxInjectedTokens;
    private Boolean memoryEnabled;
    private Map<String, String> metadata;
    private String ownerId;
    private String ownerType;
    private Map<String, String> retentionPolicy;
    private Boolean reviewRequired;
    private Map<String, String> sensitivityPolicy;
    private String spaceType;
    private String title;

    public Boolean getAutoExtractEnabled() {
        return this.autoExtractEnabled;
    }

    public void setAutoExtractEnabled(Boolean autoExtractEnabled) {
        this.autoExtractEnabled = autoExtractEnabled;
    }

    public Boolean getAutoRecallEnabled() {
        return this.autoRecallEnabled;
    }

    public void setAutoRecallEnabled(Boolean autoRecallEnabled) {
        this.autoRecallEnabled = autoRecallEnabled;
    }

    public Integer getMaxInjectedTokens() {
        return this.maxInjectedTokens;
    }

    public void setMaxInjectedTokens(Integer maxInjectedTokens) {
        this.maxInjectedTokens = maxInjectedTokens;
    }

    public Boolean getMemoryEnabled() {
        return this.memoryEnabled;
    }

    public void setMemoryEnabled(Boolean memoryEnabled) {
        this.memoryEnabled = memoryEnabled;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getOwnerId() {
        return this.ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerType() {
        return this.ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public Map<String, String> getRetentionPolicy() {
        return this.retentionPolicy;
    }

    public void setRetentionPolicy(Map<String, String> retentionPolicy) {
        this.retentionPolicy = retentionPolicy;
    }

    public Boolean getReviewRequired() {
        return this.reviewRequired;
    }

    public void setReviewRequired(Boolean reviewRequired) {
        this.reviewRequired = reviewRequired;
    }

    public Map<String, String> getSensitivityPolicy() {
        return this.sensitivityPolicy;
    }

    public void setSensitivityPolicy(Map<String, String> sensitivityPolicy) {
        this.sensitivityPolicy = sensitivityPolicy;
    }

    public String getSpaceType() {
        return this.spaceType;
    }

    public void setSpaceType(String spaceType) {
        this.spaceType = spaceType;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
