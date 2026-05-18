package com.sdkwork.clawrouter.app.model;


public class IamDeviceRecord {
    private String createdAt;
    private String deviceFingerprint;
    private String id;
    private String lastSeenAt;
    private String name;
    private String tenantId;
    private Boolean trusted;
    private String userId;

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDeviceFingerprint() {
        return this.deviceFingerprint;
    }
    
    public void setDeviceFingerprint(String deviceFingerprint) {
        this.deviceFingerprint = deviceFingerprint;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getLastSeenAt() {
        return this.lastSeenAt;
    }
    
    public void setLastSeenAt(String lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Boolean getTrusted() {
        return this.trusted;
    }
    
    public void setTrusted(Boolean trusted) {
        this.trusted = trusted;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
