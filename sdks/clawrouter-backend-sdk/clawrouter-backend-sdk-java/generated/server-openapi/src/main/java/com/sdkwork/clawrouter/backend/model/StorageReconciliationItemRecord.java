package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class StorageReconciliationItemRecord {
    private String actualHash;
    private String actualSizeBytes;
    private String bucketId;
    private String createdAt;
    private String expectedHash;
    private String expectedSizeBytes;
    private String id;
    private String issueType;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String objectBlobId;
    private String objectKey;
    private String organizationId;
    private String payloadHash;
    private Map<String, String> repairPayload;
    private String repairStatus;
    private String requestId;
    private String retentionUntil;
    private String runId;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getActualHash() {
        return this.actualHash;
    }

    public void setActualHash(String actualHash) {
        this.actualHash = actualHash;
    }

    public String getActualSizeBytes() {
        return this.actualSizeBytes;
    }

    public void setActualSizeBytes(String actualSizeBytes) {
        this.actualSizeBytes = actualSizeBytes;
    }

    public String getBucketId() {
        return this.bucketId;
    }

    public void setBucketId(String bucketId) {
        this.bucketId = bucketId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getExpectedHash() {
        return this.expectedHash;
    }

    public void setExpectedHash(String expectedHash) {
        this.expectedHash = expectedHash;
    }

    public String getExpectedSizeBytes() {
        return this.expectedSizeBytes;
    }

    public void setExpectedSizeBytes(String expectedSizeBytes) {
        this.expectedSizeBytes = expectedSizeBytes;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIssueType() {
        return this.issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
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

    public String getObjectBlobId() {
        return this.objectBlobId;
    }

    public void setObjectBlobId(String objectBlobId) {
        this.objectBlobId = objectBlobId;
    }

    public String getObjectKey() {
        return this.objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
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

    public Map<String, String> getRepairPayload() {
        return this.repairPayload;
    }

    public void setRepairPayload(Map<String, String> repairPayload) {
        this.repairPayload = repairPayload;
    }

    public String getRepairStatus() {
        return this.repairStatus;
    }

    public void setRepairStatus(String repairStatus) {
        this.repairStatus = repairStatus;
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

    public String getRunId() {
        return this.runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
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
