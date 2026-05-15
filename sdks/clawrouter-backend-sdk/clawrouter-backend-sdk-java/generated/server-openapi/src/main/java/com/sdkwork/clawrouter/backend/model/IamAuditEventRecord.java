package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IamAuditEventRecord {
    private String action;
    private String actorUserId;
    private String appId;
    private String createdAt;
    private Map<String, String> detailJson;
    private String environment;
    private String id;
    private String organizationId;
    private String requestId;
    private String resourceId;
    private String resourceType;
    private String shardingKey;
    private String tenantId;

    public String getAction() {
        return this.action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }

    public String getActorUserId() {
        return this.actorUserId;
    }
    
    public void setActorUserId(String actorUserId) {
        this.actorUserId = actorUserId;
    }

    public String getAppId() {
        return this.appId;
    }
    
    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Map<String, String> getDetailJson() {
        return this.detailJson;
    }
    
    public void setDetailJson(Map<String, String> detailJson) {
        this.detailJson = detailJson;
    }

    public String getEnvironment() {
        return this.environment;
    }
    
    public void setEnvironment(String environment) {
        this.environment = environment;
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

    public String getRequestId() {
        return this.requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getResourceId() {
        return this.resourceId;
    }
    
    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceType() {
        return this.resourceType;
    }
    
    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getShardingKey() {
        return this.shardingKey;
    }
    
    public void setShardingKey(String shardingKey) {
        this.shardingKey = shardingKey;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
