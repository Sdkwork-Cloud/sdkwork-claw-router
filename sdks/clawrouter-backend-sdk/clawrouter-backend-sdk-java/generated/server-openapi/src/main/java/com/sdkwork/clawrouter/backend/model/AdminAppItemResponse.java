package com.sdkwork.clawrouter.backend.model;

import java.util.List;
import java.util.Map;

public class AdminAppItemResponse {
    private String accessUrl;
    private String appKey;
    private String appType;
    private MediaResource artifact;
    private String bundleId;
    private AdminAppConfig config;
    private String createdAt;
    private String description;
    private MediaResource icon;
    private String id;
    private Map<String, String> installConfig;
    private Map<String, String> installPlatforms;
    private Map<String, String> installSkill;
    private String marketStatus;
    private String name;
    private String packageName;
    private Map<String, String> platforms;
    private String projectId;
    private List<Map<String, String>> releaseNotes;
    private Map<String, String> resourceList;
    private String status;
    private String storeUrl;
    private String updatedAt;
    private String userId;
    private String uuid;
    private String version;

    public String getAccessUrl() {
        return this.accessUrl;
    }

    public void setAccessUrl(String accessUrl) {
        this.accessUrl = accessUrl;
    }

    public String getAppKey() {
        return this.appKey;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public String getAppType() {
        return this.appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
    }

    public MediaResource getArtifact() {
        return this.artifact;
    }

    public void setArtifact(MediaResource artifact) {
        this.artifact = artifact;
    }

    public String getBundleId() {
        return this.bundleId;
    }

    public void setBundleId(String bundleId) {
        this.bundleId = bundleId;
    }

    public AdminAppConfig getConfig() {
        return this.config;
    }

    public void setConfig(AdminAppConfig config) {
        this.config = config;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MediaResource getIcon() {
        return this.icon;
    }

    public void setIcon(MediaResource icon) {
        this.icon = icon;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getInstallConfig() {
        return this.installConfig;
    }

    public void setInstallConfig(Map<String, String> installConfig) {
        this.installConfig = installConfig;
    }

    public Map<String, String> getInstallPlatforms() {
        return this.installPlatforms;
    }

    public void setInstallPlatforms(Map<String, String> installPlatforms) {
        this.installPlatforms = installPlatforms;
    }

    public Map<String, String> getInstallSkill() {
        return this.installSkill;
    }

    public void setInstallSkill(Map<String, String> installSkill) {
        this.installSkill = installSkill;
    }

    public String getMarketStatus() {
        return this.marketStatus;
    }

    public void setMarketStatus(String marketStatus) {
        this.marketStatus = marketStatus;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPackageName() {
        return this.packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Map<String, String> getPlatforms() {
        return this.platforms;
    }

    public void setPlatforms(Map<String, String> platforms) {
        this.platforms = platforms;
    }

    public String getProjectId() {
        return this.projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public List<Map<String, String>> getReleaseNotes() {
        return this.releaseNotes;
    }

    public void setReleaseNotes(List<Map<String, String>> releaseNotes) {
        this.releaseNotes = releaseNotes;
    }

    public Map<String, String> getResourceList() {
        return this.resourceList;
    }

    public void setResourceList(Map<String, String> resourceList) {
        this.resourceList = resourceList;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStoreUrl() {
        return this.storeUrl;
    }

    public void setStoreUrl(String storeUrl) {
        this.storeUrl = storeUrl;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
