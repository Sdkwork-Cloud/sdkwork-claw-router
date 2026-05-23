package com.sdkwork.clawrouter.app.model;


public class MemorySpaceItem {
    private Boolean autoExtractEnabled;
    private Boolean autoRecallEnabled;
    private String createdAt;
    private Integer entryCount;
    private String id;
    private Integer maxInjectedTokens;
    private Boolean memoryEnabled;
    private String ownerId;
    private String ownerType;
    private Boolean reviewRequired;
    private String spaceType;
    private String status;
    private String title;
    private String updatedAt;

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

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getEntryCount() {
        return this.entryCount;
    }

    public void setEntryCount(Integer entryCount) {
        this.entryCount = entryCount;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Boolean getReviewRequired() {
        return this.reviewRequired;
    }

    public void setReviewRequired(Boolean reviewRequired) {
        this.reviewRequired = reviewRequired;
    }

    public String getSpaceType() {
        return this.spaceType;
    }

    public void setSpaceType(String spaceType) {
        this.spaceType = spaceType;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
