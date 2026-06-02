package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminCourseMutationRequest {
    private String category;
    private String courseCode;
    private String description;
    private Map<String, String> instructorSnapshot;
    private String level;
    private Map<String, String> metadata;
    private String status;
    private MediaResource thumbnail;
    private String title;

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCourseCode() {
        return this.courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Map<String, String> getInstructorSnapshot() {
        return this.instructorSnapshot;
    }

    public void setInstructorSnapshot(Map<String, String> instructorSnapshot) {
        this.instructorSnapshot = instructorSnapshot;
    }

    public String getLevel() {
        return this.level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public MediaResource getThumbnail() {
        return this.thumbnail;
    }

    public void setThumbnail(MediaResource thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
