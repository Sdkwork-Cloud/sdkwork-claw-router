package com.sdkwork.clawrouter.backend.model;


public class AdminCourseEngagementItem {
    private Integer count;
    private String courseId;
    private String id;
    private String reactionType;
    private String reactionValue;
    private String status;

    public Integer getCount() {
        return this.count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

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

    public String getReactionType() {
        return this.reactionType;
    }

    public void setReactionType(String reactionType) {
        this.reactionType = reactionType;
    }

    public String getReactionValue() {
        return this.reactionValue;
    }

    public void setReactionValue(String reactionValue) {
        this.reactionValue = reactionValue;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
