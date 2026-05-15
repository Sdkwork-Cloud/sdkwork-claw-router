package com.sdkwork.clawrouter.app.model;


public class CourseApplicationCreateResponse {
    private Integer applicationId;
    private String category;
    private String contactEmail;
    private String contactName;
    private String description;
    private String externalBvid;
    private String id;
    private String sourceProvider;
    private String status;
    private String submittedAt;
    private String title;
    private String videoUrl;

    public Integer getApplicationId() {
        return this.applicationId;
    }
    
    public void setApplicationId(Integer applicationId) {
        this.applicationId = applicationId;
    }

    public String getCategory() {
        return this.category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }

    public String getContactEmail() {
        return this.contactEmail;
    }
    
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactName() {
        return this.contactName;
    }
    
    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getExternalBvid() {
        return this.externalBvid;
    }
    
    public void setExternalBvid(String externalBvid) {
        this.externalBvid = externalBvid;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getSourceProvider() {
        return this.sourceProvider;
    }
    
    public void setSourceProvider(String sourceProvider) {
        this.sourceProvider = sourceProvider;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubmittedAt() {
        return this.submittedAt;
    }
    
    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public String getVideoUrl() {
        return this.videoUrl;
    }
    
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}
