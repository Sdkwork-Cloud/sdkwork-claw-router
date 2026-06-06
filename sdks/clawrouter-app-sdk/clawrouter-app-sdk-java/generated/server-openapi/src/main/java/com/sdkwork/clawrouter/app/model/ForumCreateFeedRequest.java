package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumCreateFeedRequest {
    private String categoryId;
    private String content;
    private List<MediaResource> images;
    private String source;
    private String sourceUrl;
    private List<String> tags;
    private String title;

    public String getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<MediaResource> getImages() {
        return this.images;
    }

    public void setImages(List<MediaResource> images) {
        this.images = images;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourceUrl() {
        return this.sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public List<String> getTags() {
        return this.tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
