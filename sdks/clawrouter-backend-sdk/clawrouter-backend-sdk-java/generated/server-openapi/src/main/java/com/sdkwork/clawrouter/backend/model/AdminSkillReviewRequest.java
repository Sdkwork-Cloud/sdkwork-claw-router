package com.sdkwork.clawrouter.backend.model;


public class AdminSkillReviewRequest {
    private String comment;
    private String reviewComment;

    public String getComment() {
        return this.comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getReviewComment() {
        return this.reviewComment;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }
}
