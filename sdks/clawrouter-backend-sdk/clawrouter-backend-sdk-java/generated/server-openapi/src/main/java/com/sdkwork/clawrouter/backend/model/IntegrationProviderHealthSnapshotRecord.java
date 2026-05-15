package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IntegrationProviderHealthSnapshotRecord {
    private String channelId;
    private String checkType;
    private String checkedAt;
    private String createdAt;
    private String errorCode;
    private String errorMessageMasked;
    private String healthStatus;
    private Integer httpStatus;
    private String id;
    private Integer latencyMs;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String organizationId;
    private String payloadHash;
    private String providerAccountId;
    private String providerId;
    private Map<String, String> quotaSnapshot;
    private String requestId;
    private String retentionUntil;
    private String status;
    private String tenantId;
    private String traceId;
    private String userId;
    private String uuid;

    public String getChannelId() {
        return this.channelId;
    }
    
    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getCheckType() {
        return this.checkType;
    }
    
    public void setCheckType(String checkType) {
        this.checkType = checkType;
    }

    public String getCheckedAt() {
        return this.checkedAt;
    }
    
    public void setCheckedAt(String checkedAt) {
        this.checkedAt = checkedAt;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getErrorCode() {
        return this.errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessageMasked() {
        return this.errorMessageMasked;
    }
    
    public void setErrorMessageMasked(String errorMessageMasked) {
        this.errorMessageMasked = errorMessageMasked;
    }

    public String getHealthStatus() {
        return this.healthStatus;
    }
    
    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Integer getHttpStatus() {
        return this.httpStatus;
    }
    
    public void setHttpStatus(Integer httpStatus) {
        this.httpStatus = httpStatus;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Integer getLatencyMs() {
        return this.latencyMs;
    }
    
    public void setLatencyMs(Integer latencyMs) {
        this.latencyMs = latencyMs;
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

    public String getProviderAccountId() {
        return this.providerAccountId;
    }
    
    public void setProviderAccountId(String providerAccountId) {
        this.providerAccountId = providerAccountId;
    }

    public String getProviderId() {
        return this.providerId;
    }
    
    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public Map<String, String> getQuotaSnapshot() {
        return this.quotaSnapshot;
    }
    
    public void setQuotaSnapshot(Map<String, String> quotaSnapshot) {
        this.quotaSnapshot = quotaSnapshot;
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
