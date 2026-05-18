package com.sdkwork.clawrouter.app.model;


public class AgentItem {
    private String avatarUrl;
    private AgentCapabilities capabilities;
    private String code;
    private String createdAt;
    private AgentVersionItem defaultVersion;
    private String description;
    private String id;
    private String name;
    private Integer ownerUserId;
    private String status;
    private String templateSource;
    private String updatedAt;
    private String visibility;

    public String getAvatarUrl() {
        return this.avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public AgentCapabilities getCapabilities() {
        return this.capabilities;
    }
    
    public void setCapabilities(AgentCapabilities capabilities) {
        this.capabilities = capabilities;
    }

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public AgentVersionItem getDefaultVersion() {
        return this.defaultVersion;
    }
    
    public void setDefaultVersion(AgentVersionItem defaultVersion) {
        this.defaultVersion = defaultVersion;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public Integer getOwnerUserId() {
        return this.ownerUserId;
    }
    
    public void setOwnerUserId(Integer ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTemplateSource() {
        return this.templateSource;
    }
    
    public void setTemplateSource(String templateSource) {
        this.templateSource = templateSource;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getVisibility() {
        return this.visibility;
    }
    
    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
}
