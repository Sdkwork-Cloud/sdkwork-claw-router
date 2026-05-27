package com.sdkwork.clawrouter.backend.model;


public class AdminCourseApplicationItem {
    private String id;
    private String reviewedAt;
    private String status;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReviewedAt() {
        return this.reviewedAt;
    }

    public void setReviewedAt(String reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
