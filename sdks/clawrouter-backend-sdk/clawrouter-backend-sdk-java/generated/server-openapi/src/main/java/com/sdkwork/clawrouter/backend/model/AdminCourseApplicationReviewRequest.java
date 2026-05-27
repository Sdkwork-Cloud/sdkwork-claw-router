package com.sdkwork.clawrouter.backend.model;


public class AdminCourseApplicationReviewRequest {
    private String reviewNote;
    private String status;

    public String getReviewNote() {
        return this.reviewNote;
    }

    public void setReviewNote(String reviewNote) {
        this.reviewNote = reviewNote;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
