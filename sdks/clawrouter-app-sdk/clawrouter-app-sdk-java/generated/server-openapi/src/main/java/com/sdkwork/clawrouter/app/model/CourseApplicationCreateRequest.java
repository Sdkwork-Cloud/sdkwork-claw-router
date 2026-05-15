package com.sdkwork.clawrouter.app.model;


public class CourseApplicationCreateRequest {
    private String category;
    private String contactEmail;
    private String contactName;
    private String description;
    private String externalBvid;
    private String notes;
    private String sourceProvider;
    private String title;
    private String videoUrl;

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

    public String getNotes() {
        return this.notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getSourceProvider() {
        return this.sourceProvider;
    }
    
    public void setSourceProvider(String sourceProvider) {
        this.sourceProvider = sourceProvider;
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
