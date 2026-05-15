package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class ContentReactionRecord {
    private String cancelledAt;
    private String clientIpHash;
    private String createdAt;
    private String id;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String reactionType;
    private String reactionValue;
    private String requestId;
    private String retentionUntil;
    private String status;
    private String targetId;
    private String targetType;
    private String tenantId;
    private String traceId;
    private String userAgentHash;
    private String userId;
    private String uuid;

    public String getCancelledAt() {
        return this.cancelledAt;
    }
    
    public void setCancelledAt(String cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getClientIpHash() {
        return this.clientIpHash;
    }
    
    public void setClientIpHash(String clientIpHash) {
        this.clientIpHash = clientIpHash;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }
    
    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
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

    public String getReactionType() {
        return this.reactionType;
    }
    
    public void setReactionType(String reactionType) {
        this.reactionType = reactionType;
    }

    public String getReactionValue() {
        return this.reactionValue;
    }
    
    public void setReactionValue(String reactionValue) {
        this.reactionValue = reactionValue;
    }

    public String getRequestId() {
        return this.requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }
    
    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetId() {
        return this.targetId;
    }
    
    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getTargetType() {
        return this.targetType;
    }
    
    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTraceId() {
        return this.traceId;
    }
    
    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getUserAgentHash() {
        return this.userAgentHash;
    }
    
    public void setUserAgentHash(String userAgentHash) {
        this.userAgentHash = userAgentHash;
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
