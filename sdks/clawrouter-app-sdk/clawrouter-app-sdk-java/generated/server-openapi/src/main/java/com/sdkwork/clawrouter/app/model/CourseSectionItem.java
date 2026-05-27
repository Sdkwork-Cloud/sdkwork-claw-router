package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CourseSectionItem {
    private String description;
    private Integer durationSeconds;
    private String id;
    private Integer lessonCount;
    private List<CourseLessonItem> lessons;
    private Integer sectionId;
    private Integer sectionNo;
    private Integer sortOrder;
    private String title;

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationSeconds() {
        return this.durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLessonCount() {
        return this.lessonCount;
    }

    public void setLessonCount(Integer lessonCount) {
        this.lessonCount = lessonCount;
    }

    public List<CourseLessonItem> getLessons() {
        return this.lessons;
    }

    public void setLessons(List<CourseLessonItem> lessons) {
        this.lessons = lessons;
    }

    public Integer getSectionId() {
        return this.sectionId;
    }

    public void setSectionId(Integer sectionId) {
        this.sectionId = sectionId;
    }

    public Integer getSectionNo() {
        return this.sectionNo;
    }

    public void setSectionNo(Integer sectionNo) {
        this.sectionNo = sectionNo;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
