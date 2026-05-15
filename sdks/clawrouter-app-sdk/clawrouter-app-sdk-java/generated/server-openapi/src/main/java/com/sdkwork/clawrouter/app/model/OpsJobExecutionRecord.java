package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class OpsJobExecutionRecord {
    private String createdAt;
    private String durationMs;
    private String endedAt;
    private String executionStatus;
    private String failureCount;
    private String failureReason;
    private String id;
    private String jobName;
    private String jobType;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private Map<String, String> payload;
    private String payloadHash;
    private String processedCount;
    private String requestId;
    private String retentionUntil;
    private String startedAt;
    private String status;
    private String successCount;
    private String tenantId;
    private String traceId;
    private String triggerType;
    private String userId;
    private String uuid;

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDurationMs() {
        return this.durationMs;
    }
    
    public void setDurationMs(String durationMs) {
        this.durationMs = durationMs;
    }

    public String getEndedAt() {
        return this.endedAt;
    }
    
    public void setEndedAt(String endedAt) {
        this.endedAt = endedAt;
    }

    public String getExecutionStatus() {
        return this.executionStatus;
    }
    
    public void setExecutionStatus(String executionStatus) {
        this.executionStatus = executionStatus;
    }

    public String getFailureCount() {
        return this.failureCount;
    }
    
    public void setFailureCount(String failureCount) {
        this.failureCount = failureCount;
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

    public String getJobName() {
        return this.jobName;
    }
    
    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getJobType() {
        return this.jobType;
    }
    
    public void setJobType(String jobType) {
        this.jobType = jobType;
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

    public Map<String, String> getPayload() {
        return this.payload;
    }
    
    public void setPayload(Map<String, String> payload) {
        this.payload = payload;
    }

    public String getPayloadHash() {
        return this.payloadHash;
    }
    
    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getProcessedCount() {
        return this.processedCount;
    }
    
    public void setProcessedCount(String processedCount) {
        this.processedCount = processedCount;
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

    public String getStartedAt() {
        return this.startedAt;
    }
    
    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getSuccessCount() {
        return this.successCount;
    }
    
    public void setSuccessCount(String successCount) {
        this.successCount = successCount;
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

    public String getTriggerType() {
        return this.triggerType;
    }
    
    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
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
