package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppDetailResponse {
    private String category;
    private String description;
    private String developer;
    private String downloads;
    private List<String> features;
    private String id;
    private MediaResource image;
    private String name;
    private Double rating;
    private List<AppReleaseItem> releases;
    private List<MediaResource> screenshots;

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeveloper() {
        return this.developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public String getDownloads() {
        return this.downloads;
    }

    public void setDownloads(String downloads) {
        this.downloads = downloads;
    }

    public List<String> getFeatures() {
        return this.features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public MediaResource getImage() {
        return this.image;
    }

    public void setImage(MediaResource image) {
        this.image = image;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getRating() {
        return this.rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public List<AppReleaseItem> getReleases() {
        return this.releases;
    }

    public void setReleases(List<AppReleaseItem> releases) {
        this.releases = releases;
    }

    public List<MediaResource> getScreenshots() {
        return this.screenshots;
    }

    public void setScreenshots(List<MediaResource> screenshots) {
        this.screenshots = screenshots;
    }
}
