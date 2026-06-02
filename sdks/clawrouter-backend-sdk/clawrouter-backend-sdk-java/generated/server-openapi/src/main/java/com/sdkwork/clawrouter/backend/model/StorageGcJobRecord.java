package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class StorageGcJobRecord {
    private String candidateCount;
    private String completedAt;
    private String createdAt;
    private Map<String, String> criteriaJson;
    private String cursorToken;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String deletedObjectCount;
    private Boolean dryRun;
    private String id;
    private String idempotencyKey;
    private String jobType;
    private Map<String, String> metadata;
    private String organizationId;
    private String releasedBytes;
    private String requestId;
    private String requestedBy;
    private Map<String, String> resultJson;
    private String startedAt;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;

    public String getCandidateCount() {
        return this.candidateCount;
    }

    public void setCandidateCount(String candidateCount) {
        this.candidateCount = candidateCount;
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

    public Map<String, String> getCriteriaJson() {
        return this.criteriaJson;
    }

    public void setCriteriaJson(Map<String, String> criteriaJson) {
        this.criteriaJson = criteriaJson;
    }

    public String getCursorToken() {
        return this.cursorToken;
    }

    public void setCursorToken(String cursorToken) {
        this.cursorToken = cursorToken;
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

    public String getDeletedObjectCount() {
        return this.deletedObjectCount;
    }

    public void setDeletedObjectCount(String deletedObjectCount) {
        this.deletedObjectCount = deletedObjectCount;
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

    public String getJobType() {
        return this.jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
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

    public String getReleasedBytes() {
        return this.releasedBytes;
    }

    public void setReleasedBytes(String releasedBytes) {
        this.releasedBytes = releasedBytes;
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

    public Map<String, String> getResultJson() {
        return this.resultJson;
    }

    public void setResultJson(Map<String, String> resultJson) {
        this.resultJson = resultJson;
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
