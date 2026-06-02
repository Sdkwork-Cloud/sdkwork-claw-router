package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class StorageReconciliationRunRecord {
    private String bucketId;
    private String checkMode;
    private String checksumMismatchCount;
    private String completedAt;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private Boolean dryRun;
    private String id;
    private String idempotencyKey;
    private Map<String, String> metadata;
    private String missingObjectCount;
    private String organizationId;
    private String orphanObjectCount;
    private String providerId;
    private String requestId;
    private String requestedBy;
    private String runType;
    private String scannedObjectCount;
    private String startedAt;
    private String status;
    private Map<String, String> summaryJson;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public String getBucketId() {
        return this.bucketId;
    }

    public void setBucketId(String bucketId) {
        this.bucketId = bucketId;
    }

    public String getCheckMode() {
        return this.checkMode;
    }

    public void setCheckMode(String checkMode) {
        this.checkMode = checkMode;
    }

    public String getChecksumMismatchCount() {
        return this.checksumMismatchCount;
    }

    public void setChecksumMismatchCount(String checksumMismatchCount) {
        this.checksumMismatchCount = checksumMismatchCount;
    }

    public String getCompletedAt() {
        return this.completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDataScope() {
        return this.dataScope;
    }

    public void setDataScope(String dataScope) {
        this.dataScope = dataScope;
    }

    public String getDeletedAt() {
        return this.deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getDeletedBy() {
        return this.deletedBy;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public Boolean getDryRun() {
        return this.dryRun;
    }

    public void setDryRun(Boolean dryRun) {
        this.dryRun = dryRun;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdempotencyKey() {
        return this.idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getMissingObjectCount() {
        return this.missingObjectCount;
    }

    public void setMissingObjectCount(String missingObjectCount) {
        this.missingObjectCount = missingObjectCount;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getOrphanObjectCount() {
        return this.orphanObjectCount;
    }

    public void setOrphanObjectCount(String orphanObjectCount) {
        this.orphanObjectCount = orphanObjectCount;
    }

    public String getProviderId() {
        return this.providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRequestedBy() {
        return this.requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getRunType() {
        return this.runType;
    }

    public void setRunType(String runType) {
        this.runType = runType;
    }

    public String getScannedObjectCount() {
        return this.scannedObjectCount;
    }

    public void setScannedObjectCount(String scannedObjectCount) {
        this.scannedObjectCount = scannedObjectCount;
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

    public Map<String, String> getSummaryJson() {
        return this.summaryJson;
    }

    public void setSummaryJson(Map<String, String> summaryJson) {
        this.summaryJson = summaryJson;
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

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
