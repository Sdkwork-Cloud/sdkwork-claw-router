package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class PlusFavoriteRecord {
    private String folderId;
    private Map<String, String> image;
    private String lastViewedAt;
    private String remark;
    private String tags;
    private String title;
    private String userId;

    public String getFolderId() {
        return this.folderId;
    }
    
    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }

    public Map<String, String> getImage() {
        return this.image;
    }
    
    public void setImage(Map<String, String> image) {
        this.image = image;
    }

    public String getLastViewedAt() {
        return this.lastViewedAt;
    }
    
    public void setLastViewedAt(String lastViewedAt) {
        this.lastViewedAt = lastViewedAt;
    }

    public String getRemark() {
        return this.remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getTags() {
        return this.tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
