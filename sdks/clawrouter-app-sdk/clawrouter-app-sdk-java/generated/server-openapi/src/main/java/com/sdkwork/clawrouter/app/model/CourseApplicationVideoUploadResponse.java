package com.sdkwork.clawrouter.app.model;


public class CourseApplicationVideoUploadResponse {
    private String contentType;
    private String fileName;
    private String sha256;
    private Integer sizeBytes;
    private String uploadedAt;
    private MediaResource video;

    public String getContentType() {
        return this.contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getSha256() {
        return this.sha256;
    }

    public void setSha256(String sha256) {
        this.sha256 = sha256;
    }

    public Integer getSizeBytes() {
        return this.sizeBytes;
    }

    public void setSizeBytes(Integer sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public String getUploadedAt() {
        return this.uploadedAt;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public MediaResource getVideo() {
        return this.video;
    }

    public void setVideo(MediaResource video) {
        this.video = video;
    }
}
