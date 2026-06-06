package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CourseDetail {
    private String category;
    private String categoryLabel;
    private String commentCount;
    private String content;
    private String contentId;
    private String courseCode;
    private String currency;
    private String description;
    private String durationText;
    private CourseEngagement engagement;
    private String externalBvid;
    private String id;
    private CourseInstructor instructor;
    private Boolean isCollection;
    private String lessonsCount;
    private String level;
    private String levelLabel;
    private String priceAmount;
    private String publishedAt;
    private Double ratingScore;
    private List<CourseItem> relatedCourses;
    private List<CourseSectionItem> sections;
    private CourseOverviewSource source;
    private String studentsCount;
    private List<String> tags;
    private MediaResource thumbnail;
    private String title;

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryLabel() {
        return this.categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getCommentCount() {
        return this.commentCount;
    }

    public void setCommentCount(String commentCount) {
        this.commentCount = commentCount;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentId() {
        return this.contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getCourseCode() {
        return this.courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCurrency() {
        return this.currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDurationText() {
        return this.durationText;
    }

    public void setDurationText(String durationText) {
        this.durationText = durationText;
    }

    public CourseEngagement getEngagement() {
        return this.engagement;
    }

    public void setEngagement(CourseEngagement engagement) {
        this.engagement = engagement;
    }

    public String getExternalBvid() {
        return this.externalBvid;
    }

    public void setExternalBvid(String externalBvid) {
        this.externalBvid = externalBvid;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CourseInstructor getInstructor() {
        return this.instructor;
    }

    public void setInstructor(CourseInstructor instructor) {
        this.instructor = instructor;
    }

    public Boolean getIsCollection() {
        return this.isCollection;
    }

    public void setIsCollection(Boolean isCollection) {
        this.isCollection = isCollection;
    }

    public String getLessonsCount() {
        return this.lessonsCount;
    }

    public void setLessonsCount(String lessonsCount) {
        this.lessonsCount = lessonsCount;
    }

    public String getLevel() {
        return this.level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getLevelLabel() {
        return this.levelLabel;
    }

    public void setLevelLabel(String levelLabel) {
        this.levelLabel = levelLabel;
    }

    public String getPriceAmount() {
        return this.priceAmount;
    }

    public void setPriceAmount(String priceAmount) {
        this.priceAmount = priceAmount;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Double getRatingScore() {
        return this.ratingScore;
    }

    public void setRatingScore(Double ratingScore) {
        this.ratingScore = ratingScore;
    }

    public List<CourseItem> getRelatedCourses() {
        return this.relatedCourses;
    }

    public void setRelatedCourses(List<CourseItem> relatedCourses) {
        this.relatedCourses = relatedCourses;
    }

    public List<CourseSectionItem> getSections() {
        return this.sections;
    }

    public void setSections(List<CourseSectionItem> sections) {
        this.sections = sections;
    }

    public CourseOverviewSource getSource() {
        return this.source;
    }

    public void setSource(CourseOverviewSource source) {
        this.source = source;
    }

    public String getStudentsCount() {
        return this.studentsCount;
    }

    public void setStudentsCount(String studentsCount) {
        this.studentsCount = studentsCount;
    }

    public List<String> getTags() {
        return this.tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public MediaResource getThumbnail() {
        return this.thumbnail;
    }

    public void setThumbnail(MediaResource thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
