package com.sdkwork.clawrouter.backend.model;


public class AdminCourseDashboard {
    private String draftCourses;
    private String id;
    private String publishedCourses;
    private String reviewQueue;
    private String totalComments;
    private String totalCourses;
    private String totalEngagement;
    private String totalLessons;
    private String totalStudents;

    public String getDraftCourses() {
        return this.draftCourses;
    }

    public void setDraftCourses(String draftCourses) {
        this.draftCourses = draftCourses;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPublishedCourses() {
        return this.publishedCourses;
    }

    public void setPublishedCourses(String publishedCourses) {
        this.publishedCourses = publishedCourses;
    }

    public String getReviewQueue() {
        return this.reviewQueue;
    }

    public void setReviewQueue(String reviewQueue) {
        this.reviewQueue = reviewQueue;
    }

    public String getTotalComments() {
        return this.totalComments;
    }

    public void setTotalComments(String totalComments) {
        this.totalComments = totalComments;
    }

    public String getTotalCourses() {
        return this.totalCourses;
    }

    public void setTotalCourses(String totalCourses) {
        this.totalCourses = totalCourses;
    }

    public String getTotalEngagement() {
        return this.totalEngagement;
    }

    public void setTotalEngagement(String totalEngagement) {
        this.totalEngagement = totalEngagement;
    }

    public String getTotalLessons() {
        return this.totalLessons;
    }

    public void setTotalLessons(String totalLessons) {
        this.totalLessons = totalLessons;
    }

    public String getTotalStudents() {
        return this.totalStudents;
    }

    public void setTotalStudents(String totalStudents) {
        this.totalStudents = totalStudents;
    }
}
