package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminCourseLessonMutationRequest {
    private String description;
    private Integer durationSeconds;
    private String externalBvid;
    private Boolean freePreview;
    private String lessonNo;
    private Map<String, String> metadata;
    private String sectionId;
    private String status;
    private String title;
    private String videoUrl;

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationSeconds() {
        return this.durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getExternalBvid() {
        return this.externalBvid;
    }

    public void setExternalBvid(String externalBvid) {
        this.externalBvid = externalBvid;
    }

    public Boolean getFreePreview() {
        return this.freePreview;
    }

    public void setFreePreview(Boolean freePreview) {
        this.freePreview = freePreview;
    }

    public String getLessonNo() {
        return this.lessonNo;
    }

    public void setLessonNo(String lessonNo) {
        this.lessonNo = lessonNo;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getSectionId() {
        return this.sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
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

    public String getVideoUrl() {
        return this.videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}
