package com.sdkwork.clawrouter.app.model;


public class CourseLessonItem {
    private String content;
    private String description;
    private Integer durationSeconds;
    private String durationText;
    private String externalBvid;
    private Boolean freePreview;
    private String id;
    private Integer lessonId;
    private Integer lessonNo;
    private Integer number;
    private Integer sortOrder;
    private String sourceProvider;
    private String title;
    private MediaResource video;

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

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

    public String getDurationText() {
        return this.durationText;
    }

    public void setDurationText(String durationText) {
        this.durationText = durationText;
    }

    public String getExternalBvid() {
        return this.externalBvid;
    }

    public void setExternalBvid(String externalBvid) {
        this.externalBvid = externalBvid;
    }

    public Boolean getFreePreview() {
        return this.freePreview;
    }

    public void setFreePreview(Boolean freePreview) {
        this.freePreview = freePreview;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLessonId() {
        return this.lessonId;
    }

    public void setLessonId(Integer lessonId) {
        this.lessonId = lessonId;
    }

    public Integer getLessonNo() {
        return this.lessonNo;
    }

    public void setLessonNo(Integer lessonNo) {
        this.lessonNo = lessonNo;
    }

    public Integer getNumber() {
        return this.number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getSourceProvider() {
        return this.sourceProvider;
    }

    public void setSourceProvider(String sourceProvider) {
        this.sourceProvider = sourceProvider;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public MediaResource getVideo() {
        return this.video;
    }

    public void setVideo(MediaResource video) {
        this.video = video;
    }
}
