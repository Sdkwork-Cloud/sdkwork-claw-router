package com.sdkwork.clawrouter.backend.model;

import java.util.List;
import java.util.Map;

public class AdminAppUpdateRequest {
    private String accessUrl;
    private String appType;
    private String bundleId;
    private AdminAppConfig config;
    private String description;
    private String downloadUrl;
    private Map<String, String> icon;
    private String iconUrl;
    private Map<String, String> installConfig;
    private Map<String, String> installPlatforms;
    private Map<String, String> installSkill;
    private String name;
    private String packageName;
    private Map<String, String> platforms;
    private String projectId;
    private List<Map<String, String>> releaseNotes;
    private Map<String, String> resourceList;
    private String storeUrl;
    private String userId;
    private String version;

    public String getAccessUrl() {
        return this.accessUrl;
    }

    public void setAccessUrl(String accessUrl) {
        this.accessUrl = accessUrl;
    }

    public String getAppType() {
        return this.appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
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

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDownloadUrl() {
        return this.downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public Map<String, String> getIcon() {
        return this.icon;
    }

    public void setIcon(Map<String, String> icon) {
        this.icon = icon;
    }

    public String getIconUrl() {
        return this.iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
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

    public String getStoreUrl() {
        return this.storeUrl;
    }

    public void setStoreUrl(String storeUrl) {
        this.storeUrl = storeUrl;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
