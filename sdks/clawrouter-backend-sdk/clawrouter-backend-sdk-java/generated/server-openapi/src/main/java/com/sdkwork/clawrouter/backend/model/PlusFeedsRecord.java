package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class PlusFeedsRecord {
    private Map<String, String> author;
    private Map<String, String> coverImages;
    private String publishTime;
    private Map<String, String> resourceList;
    private String source;
    private String sourceUrl;
    private String summary;
    private Map<String, String> tags;
    private String userId;

    public Map<String, String> getAuthor() {
        return this.author;
    }

    public void setAuthor(Map<String, String> author) {
        this.author = author;
    }

    public Map<String, String> getCoverImages() {
        return this.coverImages;
    }

    public void setCoverImages(Map<String, String> coverImages) {
        this.coverImages = coverImages;
    }

    public String getPublishTime() {
        return this.publishTime;
    }

    public void setPublishTime(String publishTime) {
        this.publishTime = publishTime;
    }

    public Map<String, String> getResourceList() {
        return this.resourceList;
    }

    public void setResourceList(Map<String, String> resourceList) {
        this.resourceList = resourceList;
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

    public String getSummary() {
        return this.summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Map<String, String> getTags() {
        return this.tags;
    }

    public void setTags(Map<String, String> tags) {
        this.tags = tags;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
