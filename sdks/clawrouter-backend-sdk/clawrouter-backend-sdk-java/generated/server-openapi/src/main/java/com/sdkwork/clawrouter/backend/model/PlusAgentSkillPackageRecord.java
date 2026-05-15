package com.sdkwork.clawrouter.backend.model;


public class PlusAgentSkillPackageRecord {
    private String categoryId;
    private String coverImage;
    private String description;
    private String icon;
    private String latestPublishedAt;
    private String summary;
    private String userId;

    public String getCategoryId() {
        return this.categoryId;
    }
    
    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCoverImage() {
        return this.coverImage;
    }
    
    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return this.icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getLatestPublishedAt() {
        return this.latestPublishedAt;
    }
    
    public void setLatestPublishedAt(String latestPublishedAt) {
        this.latestPublishedAt = latestPublishedAt;
    }

    public String getSummary() {
        return this.summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
