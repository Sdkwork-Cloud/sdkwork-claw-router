package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class SkillPackageItem {
    private String artifactRef;
    private Integer artifactSizeBytes;
    private List<String> frameworks;
    private String id;
    private String licenseName;
    private String publishedAt;
    private String version;

    public String getArtifactRef() {
        return this.artifactRef;
    }

    public void setArtifactRef(String artifactRef) {
        this.artifactRef = artifactRef;
    }

    public Integer getArtifactSizeBytes() {
        return this.artifactSizeBytes;
    }

    public void setArtifactSizeBytes(Integer artifactSizeBytes) {
        this.artifactSizeBytes = artifactSizeBytes;
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

    public String getLicenseName() {
        return this.licenseName;
    }

    public void setLicenseName(String licenseName) {
        this.licenseName = licenseName;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
