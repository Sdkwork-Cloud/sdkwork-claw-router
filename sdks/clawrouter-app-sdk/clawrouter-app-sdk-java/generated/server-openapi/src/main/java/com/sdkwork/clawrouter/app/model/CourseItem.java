package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CourseItem {
    private String category;
    private String categoryLabel;
    private Integer commentCount;
    private String content;
    private Integer contentId;
    private String courseCode;
    private String currency;
    private String description;
    private String durationText;
    private CourseEngagement engagement;
    private String externalBvid;
    private String id;
    private CourseInstructor instructor;
    private Boolean isCollection;
    private Integer lessonsCount;
    private Integer level;
    private String levelLabel;
    private String priceAmount;
    private String publishedAt;
    private Double ratingScore;
    private Integer studentsCount;
    private List<String> tags;
    private String thumbnailUrl;
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

    public Integer getCommentCount() {
        return this.commentCount;
    }
    
    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public String getContent() {
        return this.content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }

    public Integer getContentId() {
        return this.contentId;
    }
    
    public void setContentId(Integer contentId) {
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

    public Integer getLessonsCount() {
        return this.lessonsCount;
    }
    
    public void setLessonsCount(Integer lessonsCount) {
        this.lessonsCount = lessonsCount;
    }

    public Integer getLevel() {
        return this.level;
    }
    
    public void setLevel(Integer level) {
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

    public Integer getStudentsCount() {
        return this.studentsCount;
    }
    
    public void setStudentsCount(Integer studentsCount) {
        this.studentsCount = studentsCount;
    }

    public List<String> getTags() {
        return this.tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getThumbnailUrl() {
        return this.thumbnailUrl;
    }
    
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
}
