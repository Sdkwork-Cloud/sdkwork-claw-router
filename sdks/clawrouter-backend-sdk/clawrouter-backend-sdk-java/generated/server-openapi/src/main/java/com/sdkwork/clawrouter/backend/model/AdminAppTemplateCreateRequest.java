package com.sdkwork.clawrouter.backend.model;

import java.util.List;
import java.util.Map;

public class AdminAppTemplateCreateRequest {
    private Map<String, String> appConfigSchema;
    private List<Map<String, String>> capabilityManifest;
    private String categoryCode;
    private String categoryId;
    private MediaResource cover;
    private Map<String, String> defaultAppConfig;
    private List<Map<String, String>> dependencyManifest;
    private String description;
    private Boolean featured;
    private String framework;
    private String gitRef;
    private String gitRepoUrl;
    private String gitSubPath;
    private MediaResource icon;
    private String language;
    private String publishStatus;
    private String runtime;
    private Integer sortWeight;
    private String sourceAppId;
    private String templateCode;
    private String templateName;
    private String templateNo;
    private String templateType;
    private Map<String, String> variableSchema;
    private String visibility;

    public Map<String, String> getAppConfigSchema() {
        return this.appConfigSchema;
    }

    public void setAppConfigSchema(Map<String, String> appConfigSchema) {
        this.appConfigSchema = appConfigSchema;
    }

    public List<Map<String, String>> getCapabilityManifest() {
        return this.capabilityManifest;
    }

    public void setCapabilityManifest(List<Map<String, String>> capabilityManifest) {
        this.capabilityManifest = capabilityManifest;
    }

    public String getCategoryCode() {
        return this.categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public MediaResource getCover() {
        return this.cover;
    }

    public void setCover(MediaResource cover) {
        this.cover = cover;
    }

    public Map<String, String> getDefaultAppConfig() {
        return this.defaultAppConfig;
    }

    public void setDefaultAppConfig(Map<String, String> defaultAppConfig) {
        this.defaultAppConfig = defaultAppConfig;
    }

    public List<Map<String, String>> getDependencyManifest() {
        return this.dependencyManifest;
    }

    public void setDependencyManifest(List<Map<String, String>> dependencyManifest) {
        this.dependencyManifest = dependencyManifest;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getFeatured() {
        return this.featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public String getFramework() {
        return this.framework;
    }

    public void setFramework(String framework) {
        this.framework = framework;
    }

    public String getGitRef() {
        return this.gitRef;
    }

    public void setGitRef(String gitRef) {
        this.gitRef = gitRef;
    }

    public String getGitRepoUrl() {
        return this.gitRepoUrl;
    }

    public void setGitRepoUrl(String gitRepoUrl) {
        this.gitRepoUrl = gitRepoUrl;
    }

    public String getGitSubPath() {
        return this.gitSubPath;
    }

    public void setGitSubPath(String gitSubPath) {
        this.gitSubPath = gitSubPath;
    }

    public MediaResource getIcon() {
        return this.icon;
    }

    public void setIcon(MediaResource icon) {
        this.icon = icon;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPublishStatus() {
        return this.publishStatus;
    }

    public void setPublishStatus(String publishStatus) {
        this.publishStatus = publishStatus;
    }

    public String getRuntime() {
        return this.runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public Integer getSortWeight() {
        return this.sortWeight;
    }

    public void setSortWeight(Integer sortWeight) {
        this.sortWeight = sortWeight;
    }

    public String getSourceAppId() {
        return this.sourceAppId;
    }

    public void setSourceAppId(String sourceAppId) {
        this.sourceAppId = sourceAppId;
    }

    public String getTemplateCode() {
        return this.templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public String getTemplateName() {
        return this.templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getTemplateNo() {
        return this.templateNo;
    }

    public void setTemplateNo(String templateNo) {
        this.templateNo = templateNo;
    }

    public String getTemplateType() {
        return this.templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public Map<String, String> getVariableSchema() {
        return this.variableSchema;
    }

    public void setVariableSchema(Map<String, String> variableSchema) {
        this.variableSchema = variableSchema;
    }

    public String getVisibility() {
        return this.visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
}
