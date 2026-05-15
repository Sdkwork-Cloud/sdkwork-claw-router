package com.sdkwork.clawrouter.backend.model;


public class AdminSkillAssetCreateRequest {
    private String altText;
    private String artifactId;
    private Integer assetType;
    private String assetUrl;
    private String durationSeconds;
    private Integer fileSize;
    private Integer height;
    private String mimeType;
    private String publishedAt;
    private Integer sortOrder;
    private Integer status;
    private String thumbnailUrl;
    private String title;
    private Integer width;

    public String getAltText() {
        return this.altText;
    }
    
    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getArtifactId() {
        return this.artifactId;
    }
    
    public void setArtifactId(String artifactId) {
        this.artifactId = artifactId;
    }

    public Integer getAssetType() {
        return this.assetType;
    }
    
    public void setAssetType(Integer assetType) {
        this.assetType = assetType;
    }

    public String getAssetUrl() {
        return this.assetUrl;
    }
    
    public void setAssetUrl(String assetUrl) {
        this.assetUrl = assetUrl;
    }

    public String getDurationSeconds() {
        return this.durationSeconds;
    }
    
    public void setDurationSeconds(String durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Integer getFileSize() {
        return this.fileSize;
    }
    
    public void setFileSize(Integer fileSize) {
        this.fileSize = fileSize;
    }

    public Integer getHeight() {
        return this.height;
    }
    
    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getMimeType() {
        return this.mimeType;
    }
    
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }
    
    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getStatus() {
        return this.status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getThumbnailUrl() {
        return this.thumbnailUrl;
    }
    
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getWidth() {
        return this.width;
    }
    
    public void setWidth(Integer width) {
        this.width = width;
    }
}
