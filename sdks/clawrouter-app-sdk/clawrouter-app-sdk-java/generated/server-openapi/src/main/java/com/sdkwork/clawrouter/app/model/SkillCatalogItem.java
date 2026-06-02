package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class SkillCatalogItem {
    private String category;
    private String clawhubImage;
    private String description;
    private String developer;
    private String downloads;
    private List<String> features;
    private List<String> frameworks;
    private String id;
    private MediaResource image;
    private String lastUpdated;
    private String license;
    private String name;
    private List<SkillPackageItem> packages;
    private Double rating;
    private List<MediaResource> screenshots;
    private String size;
    private String version;

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getClawhubImage() {
        return this.clawhubImage;
    }

    public void setClawhubImage(String clawhubImage) {
        this.clawhubImage = clawhubImage;
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

    public List<String> getFrameworks() {
        return this.frameworks;
    }

    public void setFrameworks(List<String> frameworks) {
        this.frameworks = frameworks;
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

    public String getLastUpdated() {
        return this.lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getLicense() {
        return this.license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SkillPackageItem> getPackages() {
        return this.packages;
    }

    public void setPackages(List<SkillPackageItem> packages) {
        this.packages = packages;
    }

    public Double getRating() {
        return this.rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public List<MediaResource> getScreenshots() {
        return this.screenshots;
    }

    public void setScreenshots(List<MediaResource> screenshots) {
        this.screenshots = screenshots;
    }

    public String getSize() {
        return this.size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
