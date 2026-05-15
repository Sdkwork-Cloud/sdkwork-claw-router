package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class OpsInboxEventRecord {
    private String consumerName;
    private String createdAt;
    private String eventType;
    private Integer eventVersion;
    private String failureReason;
    private String id;
    private Boolean legalHold;
    private String messageId;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String processStatus;
    private String processedAt;
    private String requestId;
    private String retentionUntil;
    private Integer retryCount;
    private String sourceSystem;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getConsumerName() {
        return this.consumerName;
    }
    
    public void setConsumerName(String consumerName) {
        this.consumerName = consumerName;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEventType() {
        return this.eventType;
    }
    
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Integer getEventVersion() {
        return this.eventVersion;
    }
    
    public void setEventVersion(Integer eventVersion) {
        this.eventVersion = eventVersion;
    }

    public String getFailureReason() {
        return this.failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
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

    public String getMessageId() {
        return this.messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
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

    public String getProcessStatus() {
        return this.processStatus;
    }
    
    public void setProcessStatus(String processStatus) {
        this.processStatus = processStatus;
    }

    public String getProcessedAt() {
        return this.processedAt;
    }
    
    public void setProcessedAt(String processedAt) {
        this.processedAt = processedAt;
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

    public Integer getRetryCount() {
        return this.retryCount;
    }
    
    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public String getSourceSystem() {
        return this.sourceSystem;
    }
    
    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
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
