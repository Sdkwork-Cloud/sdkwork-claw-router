package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiUsageServiceProviderChainRecord {
    private Integer chainDepth;
    private String chainHash;
    private Map<String, String> chainPathSnapshot;
    private String createdAt;
    private String id;
    private String leafProviderId;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String occurredAt;
    private String organizationId;
    private String payloadHash;
    private String requestId;
    private String resolvedSubjectId;
    private String resolvedSubjectType;
    private String retentionUntil;
    private String rootProviderId;
    private String status;
    private String tenantId;
    private String traceId;
    private String usageFactId;
    private String userId;
    private String uuid;

    public Integer getChainDepth() {
        return this.chainDepth;
    }

    public void setChainDepth(Integer chainDepth) {
        this.chainDepth = chainDepth;
    }

    public String getChainHash() {
        return this.chainHash;
    }

    public void setChainHash(String chainHash) {
        this.chainHash = chainHash;
    }

    public Map<String, String> getChainPathSnapshot() {
        return this.chainPathSnapshot;
    }

    public void setChainPathSnapshot(Map<String, String> chainPathSnapshot) {
        this.chainPathSnapshot = chainPathSnapshot;
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

    public String getLeafProviderId() {
        return this.leafProviderId;
    }

    public void setLeafProviderId(String leafProviderId) {
        this.leafProviderId = leafProviderId;
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

    public String getOccurredAt() {
        return this.occurredAt;
    }

    public void setOccurredAt(String occurredAt) {
        this.occurredAt = occurredAt;
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

    public String getResolvedSubjectId() {
        return this.resolvedSubjectId;
    }

    public void setResolvedSubjectId(String resolvedSubjectId) {
        this.resolvedSubjectId = resolvedSubjectId;
    }

    public String getResolvedSubjectType() {
        return this.resolvedSubjectType;
    }

    public void setResolvedSubjectType(String resolvedSubjectType) {
        this.resolvedSubjectType = resolvedSubjectType;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }

    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getRootProviderId() {
        return this.rootProviderId;
    }

    public void setRootProviderId(String rootProviderId) {
        this.rootProviderId = rootProviderId;
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

    public String getUsageFactId() {
        return this.usageFactId;
    }

    public void setUsageFactId(String usageFactId) {
        this.usageFactId = usageFactId;
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
