package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class IamSecurityEventRecord {
    private String createdAt;
    private Map<String, String> detailJson;
    private String eventType;
    private String id;
    private String sessionId;
    private String severity;
    private String tenantId;
    private String userId;

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

    public String getEventType() {
        return this.eventType;
    }
    
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getSessionId() {
        return this.sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSeverity() {
        return this.severity;
    }
    
    public void setSeverity(String severity) {
        this.severity = severity;
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
