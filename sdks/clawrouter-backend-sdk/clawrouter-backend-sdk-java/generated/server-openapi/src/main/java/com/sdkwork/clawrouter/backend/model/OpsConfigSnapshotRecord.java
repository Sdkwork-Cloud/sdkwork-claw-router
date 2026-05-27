package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class OpsConfigSnapshotRecord {
    private String configHash;
    private Map<String, String> configPayload;
    private String configScope;
    private String configType;
    private String createdAt;
    private String id;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String publishedAt;
    private String publishedBy;
    private String requestId;
    private String retentionUntil;
    private String rollbackFromSnapshotId;
    private String snapshotNo;
    private Map<String, String> sourceIds;
    private String sourceTable;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getConfigHash() {
        return this.configHash;
    }

    public void setConfigHash(String configHash) {
        this.configHash = configHash;
    }

    public Map<String, String> getConfigPayload() {
        return this.configPayload;
    }

    public void setConfigPayload(Map<String, String> configPayload) {
        this.configPayload = configPayload;
    }

    public String getConfigScope() {
        return this.configScope;
    }

    public void setConfigScope(String configScope) {
        this.configScope = configScope;
    }

    public String getConfigType() {
        return this.configType;
    }

    public void setConfigType(String configType) {
        this.configType = configType;
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

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getPublishedBy() {
        return this.publishedBy;
    }

    public void setPublishedBy(String publishedBy) {
        this.publishedBy = publishedBy;
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

    public String getRollbackFromSnapshotId() {
        return this.rollbackFromSnapshotId;
    }

    public void setRollbackFromSnapshotId(String rollbackFromSnapshotId) {
        this.rollbackFromSnapshotId = rollbackFromSnapshotId;
    }

    public String getSnapshotNo() {
        return this.snapshotNo;
    }

    public void setSnapshotNo(String snapshotNo) {
        this.snapshotNo = snapshotNo;
    }

    public Map<String, String> getSourceIds() {
        return this.sourceIds;
    }

    public void setSourceIds(Map<String, String> sourceIds) {
        this.sourceIds = sourceIds;
    }

    public String getSourceTable() {
        return this.sourceTable;
    }

    public void setSourceTable(String sourceTable) {
        this.sourceTable = sourceTable;
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
