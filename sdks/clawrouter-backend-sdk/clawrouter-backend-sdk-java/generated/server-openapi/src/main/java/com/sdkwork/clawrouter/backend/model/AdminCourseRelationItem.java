package com.sdkwork.clawrouter.backend.model;


public class AdminCourseRelationItem {
    private String courseId;
    private String id;
    private String relatedCourseId;
    private String relationType;
    private String sortOrder;
    private String status;

    public String getCourseId() {
        return this.courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRelatedCourseId() {
        return this.relatedCourseId;
    }

    public void setRelatedCourseId(String relatedCourseId) {
        this.relatedCourseId = relatedCourseId;
    }

    public String getRelationType() {
        return this.relationType;
    }

    public void setRelationType(String relationType) {
        this.relationType = relationType;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
