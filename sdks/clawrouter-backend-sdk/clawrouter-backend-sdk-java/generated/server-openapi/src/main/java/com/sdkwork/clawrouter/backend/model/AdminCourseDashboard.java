package com.sdkwork.clawrouter.backend.model;


public class AdminCourseDashboard {
    private Integer draftCourses;
    private String id;
    private Integer publishedCourses;
    private Integer reviewQueue;
    private Integer totalComments;
    private Integer totalCourses;
    private Integer totalEngagement;
    private Integer totalLessons;
    private Integer totalStudents;

    public Integer getDraftCourses() {
        return this.draftCourses;
    }

    public void setDraftCourses(Integer draftCourses) {
        this.draftCourses = draftCourses;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getPublishedCourses() {
        return this.publishedCourses;
    }

    public void setPublishedCourses(Integer publishedCourses) {
        this.publishedCourses = publishedCourses;
    }

    public Integer getReviewQueue() {
        return this.reviewQueue;
    }

    public void setReviewQueue(Integer reviewQueue) {
        this.reviewQueue = reviewQueue;
    }

    public Integer getTotalComments() {
        return this.totalComments;
    }

    public void setTotalComments(Integer totalComments) {
        this.totalComments = totalComments;
    }

    public Integer getTotalCourses() {
        return this.totalCourses;
    }

    public void setTotalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
    }

    public Integer getTotalEngagement() {
        return this.totalEngagement;
    }

    public void setTotalEngagement(Integer totalEngagement) {
        this.totalEngagement = totalEngagement;
    }

    public Integer getTotalLessons() {
        return this.totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Integer getTotalStudents() {
        return this.totalStudents;
    }

    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }
}
