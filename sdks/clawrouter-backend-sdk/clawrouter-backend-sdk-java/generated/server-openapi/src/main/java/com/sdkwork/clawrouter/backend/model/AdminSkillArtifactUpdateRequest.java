package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillArtifactUpdateRequest {
    private String artifactRef;
    private Integer artifactSizeBytes;
    private Integer artifactType;
    private String artifactUrl;
    private String checksumHash;
    private String deprecatedAt;
    private List<String> frameworks;
    private String licenseName;
    private String osName;
    private String platformType;
    private String publishedAt;
    private String releaseNotes;
    private String runtime;
    private Integer status;
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

    public Integer getArtifactType() {
        return this.artifactType;
    }

    public void setArtifactType(Integer artifactType) {
        this.artifactType = artifactType;
    }

    public String getArtifactUrl() {
        return this.artifactUrl;
    }

    public void setArtifactUrl(String artifactUrl) {
        this.artifactUrl = artifactUrl;
    }

    public String getChecksumHash() {
        return this.checksumHash;
    }

    public void setChecksumHash(String checksumHash) {
        this.checksumHash = checksumHash;
    }

    public String getDeprecatedAt() {
        return this.deprecatedAt;
    }

    public void setDeprecatedAt(String deprecatedAt) {
        this.deprecatedAt = deprecatedAt;
    }

    public List<String> getFrameworks() {
        return this.frameworks;
    }

    public void setFrameworks(List<String> frameworks) {
        this.frameworks = frameworks;
    }

    public String getLicenseName() {
        return this.licenseName;
    }

    public void setLicenseName(String licenseName) {
        this.licenseName = licenseName;
    }

    public String getOsName() {
        return this.osName;
    }

    public void setOsName(String osName) {
        this.osName = osName;
    }

    public String getPlatformType() {
        return this.platformType;
    }

    public void setPlatformType(String platformType) {
        this.platformType = platformType;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getReleaseNotes() {
        return this.releaseNotes;
    }

    public void setReleaseNotes(String releaseNotes) {
        this.releaseNotes = releaseNotes;
    }

    public String getRuntime() {
        return this.runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
