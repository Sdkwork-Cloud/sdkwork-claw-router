package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamAppContext {
    private String appId;
    private String authLevel;
    private List<String> dataScope;
    private String deploymentMode;
    private String environment;
    private String organizationId;
    private List<String> permissionScope;
    private String sessionId;
    private String tenantId;
    private String userId;

    public String getAppId() {
        return this.appId;
    }
    
    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAuthLevel() {
        return this.authLevel;
    }
    
    public void setAuthLevel(String authLevel) {
        this.authLevel = authLevel;
    }

    public List<String> getDataScope() {
        return this.dataScope;
    }
    
    public void setDataScope(List<String> dataScope) {
        this.dataScope = dataScope;
    }

    public String getDeploymentMode() {
        return this.deploymentMode;
    }
    
    public void setDeploymentMode(String deploymentMode) {
        this.deploymentMode = deploymentMode;
    }

    public String getEnvironment() {
        return this.environment;
    }
    
    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public List<String> getPermissionScope() {
        return this.permissionScope;
    }
    
    public void setPermissionScope(List<String> permissionScope) {
        this.permissionScope = permissionScope;
    }

    public String getSessionId() {
        return this.sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
