package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class IamSessionRecord {
    private String accessTokenHash;
    private String appId;
    private String authLevel;
    private String authTokenHash;
    private String createdAt;
    private Map<String, String> dataScopeJson;
    private String deploymentMode;
    private String environment;
    private String expiresAt;
    private String id;
    private String organizationId;
    private Map<String, String> permissionScopeJson;
    private String refreshTokenHash;
    private String revokedAt;
    private String shardingKey;
    private String shardingStrategy;
    private String tenantId;
    private String updatedAt;
    private String userId;

    public String getAccessTokenHash() {
        return this.accessTokenHash;
    }
    
    public void setAccessTokenHash(String accessTokenHash) {
        this.accessTokenHash = accessTokenHash;
    }

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

    public String getAuthTokenHash() {
        return this.authTokenHash;
    }
    
    public void setAuthTokenHash(String authTokenHash) {
        this.authTokenHash = authTokenHash;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Map<String, String> getDataScopeJson() {
        return this.dataScopeJson;
    }
    
    public void setDataScopeJson(Map<String, String> dataScopeJson) {
        this.dataScopeJson = dataScopeJson;
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

    public String getExpiresAt() {
        return this.expiresAt;
    }
    
    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getPermissionScopeJson() {
        return this.permissionScopeJson;
    }
    
    public void setPermissionScopeJson(Map<String, String> permissionScopeJson) {
        this.permissionScopeJson = permissionScopeJson;
    }

    public String getRefreshTokenHash() {
        return this.refreshTokenHash;
    }
    
    public void setRefreshTokenHash(String refreshTokenHash) {
        this.refreshTokenHash = refreshTokenHash;
    }

    public String getRevokedAt() {
        return this.revokedAt;
    }
    
    public void setRevokedAt(String revokedAt) {
        this.revokedAt = revokedAt;
    }

    public String getShardingKey() {
        return this.shardingKey;
    }
    
    public void setShardingKey(String shardingKey) {
        this.shardingKey = shardingKey;
    }

    public String getShardingStrategy() {
        return this.shardingStrategy;
    }
    
    public void setShardingStrategy(String shardingStrategy) {
        this.shardingStrategy = shardingStrategy;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
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
}
