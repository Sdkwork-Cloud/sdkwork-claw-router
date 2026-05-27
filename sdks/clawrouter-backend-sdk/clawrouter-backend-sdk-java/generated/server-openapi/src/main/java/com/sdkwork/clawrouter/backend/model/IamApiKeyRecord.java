package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IamApiKeyRecord {
    private String createdAt;
    private String expiresAt;
    private String id;
    private String keyHash;
    private String name;
    private Map<String, String> permissionScopeJson;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String userId;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
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

    public String getKeyHash() {
        return this.keyHash;
    }

    public void setKeyHash(String keyHash) {
        this.keyHash = keyHash;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, String> getPermissionScopeJson() {
        return this.permissionScopeJson;
    }

    public void setPermissionScopeJson(Map<String, String> permissionScopeJson) {
        this.permissionScopeJson = permissionScopeJson;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
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
