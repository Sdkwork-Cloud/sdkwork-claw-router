package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class GenerationHistoryItem {
    private String aspectRatio;
    private String createdAt;
    private String date;
    private Integer durationSeconds;
    private String id;
    private List<String> images;
    private String modelCatalogKey;
    private String modelInfo;
    private String prompt;
    private String status;
    private String type;
    private String updatedAt;
    private String url;
    private List<GenerationHistoryMediaItem> videos;

    public String getAspectRatio() {
        return this.aspectRatio;
    }

    public void setAspectRatio(String aspectRatio) {
        this.aspectRatio = aspectRatio;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
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

    public List<String> getImages() {
        return this.images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getModelCatalogKey() {
        return this.modelCatalogKey;
    }

    public void setModelCatalogKey(String modelCatalogKey) {
        this.modelCatalogKey = modelCatalogKey;
    }

    public String getModelInfo() {
        return this.modelInfo;
    }

    public void setModelInfo(String modelInfo) {
        this.modelInfo = modelInfo;
    }

    public String getPrompt() {
        return this.prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<GenerationHistoryMediaItem> getVideos() {
        return this.videos;
    }

    public void setVideos(List<GenerationHistoryMediaItem> videos) {
        this.videos = videos;
    }
}
