package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CourseSectionItem {
    private String description;
    private String durationSeconds;
    private String id;
    private String lessonCount;
    private List<CourseLessonItem> lessons;
    private String sectionId;
    private String sectionNo;
    private String sortOrder;
    private String title;

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDurationSeconds() {
        return this.durationSeconds;
    }

    public void setDurationSeconds(String durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLessonCount() {
        return this.lessonCount;
    }

    public void setLessonCount(String lessonCount) {
        this.lessonCount = lessonCount;
    }

    public List<CourseLessonItem> getLessons() {
        return this.lessons;
    }

    public void setLessons(List<CourseLessonItem> lessons) {
        this.lessons = lessons;
    }

    public String getSectionId() {
        return this.sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getSectionNo() {
        return this.sectionNo;
    }

    public void setSectionNo(String sectionNo) {
        this.sectionNo = sectionNo;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
