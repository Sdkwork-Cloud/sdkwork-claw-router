package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillArtifactItem {
    private MediaResource artifact;
    private String artifactRef;
    private String artifactSizeBytes;
    private Integer artifactType;
    private String checksumHash;
    private String createdAt;
    private String deprecatedAt;
    private List<String> frameworks;
    private String id;
    private String licenseName;
    private String osName;
    private String platformType;
    private String publishedAt;
    private String releaseNotes;
    private String runtime;
    private String skillId;
    private Integer status;
    private String targetId;
    private Integer targetType;
    private String updatedAt;
    private String version;

    public MediaResource getArtifact() {
        return this.artifact;
    }

    public void setArtifact(MediaResource artifact) {
        this.artifact = artifact;
    }

    public String getArtifactRef() {
        return this.artifactRef;
    }

    public void setArtifactRef(String artifactRef) {
        this.artifactRef = artifactRef;
    }

    public String getArtifactSizeBytes() {
        return this.artifactSizeBytes;
    }

    public void setArtifactSizeBytes(String artifactSizeBytes) {
        this.artifactSizeBytes = artifactSizeBytes;
    }

    public Integer getArtifactType() {
        return this.artifactType;
    }

    public void setArtifactType(Integer artifactType) {
        this.artifactType = artifactType;
    }

    public String getChecksumHash() {
        return this.checksumHash;
    }

    public void setChecksumHash(String checksumHash) {
        this.checksumHash = checksumHash;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
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

    public String getSkillId() {
        return this.skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getTargetId() {
        return this.targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public Integer getTargetType() {
        return this.targetType;
    }

    public void setTargetType(Integer targetType) {
        this.targetType = targetType;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
