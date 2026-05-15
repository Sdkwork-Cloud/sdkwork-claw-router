package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class OpsAlertEventRecord {
    private String alertNo;
    private String alertStatus;
    private String createdAt;
    private String firstSeenAt;
    private String id;
    private String lastSeenAt;
    private Boolean legalHold;
    private String message;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String requestId;
    private String resolvedAt;
    private String resolvedBy;
    private String retentionUntil;
    private String severity;
    private String source;
    private String status;
    private String tenantId;
    private String title;
    private String traceId;
    private String userId;
    private String uuid;

    public String getAlertNo() {
        return this.alertNo;
    }
    
    public void setAlertNo(String alertNo) {
        this.alertNo = alertNo;
    }

    public String getAlertStatus() {
        return this.alertStatus;
    }
    
    public void setAlertStatus(String alertStatus) {
        this.alertStatus = alertStatus;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFirstSeenAt() {
        return this.firstSeenAt;
    }
    
    public void setFirstSeenAt(String firstSeenAt) {
        this.firstSeenAt = firstSeenAt;
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

    public Boolean getLegalHold() {
        return this.legalHold;
    }
    
    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPayloadHash() {
        return this.payloadHash;
    }
    
    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getRequestId() {
        return this.requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getResolvedAt() {
        return this.resolvedAt;
    }
    
    public void setResolvedAt(String resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedBy() {
        return this.resolvedBy;
    }
    
    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }
    
    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getSeverity() {
        return this.severity;
    }
    
    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getSource() {
        return this.source;
    }
    
    public void setSource(String source) {
        this.source = source;
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

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public String getTraceId() {
        return this.traceId;
    }
    
    public void setTraceId(String traceId) {
        this.traceId = traceId;
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
}
