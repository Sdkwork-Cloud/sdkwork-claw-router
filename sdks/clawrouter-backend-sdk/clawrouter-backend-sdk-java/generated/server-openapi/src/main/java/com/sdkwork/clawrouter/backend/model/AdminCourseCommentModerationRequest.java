package com.sdkwork.clawrouter.backend.model;


public class AdminCourseCommentModerationRequest {
    private String moderationNote;
    private String status;

    public String getModerationNote() {
        return this.moderationNote;
    }

    public void setModerationNote(String moderationNote) {
        this.moderationNote = moderationNote;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
