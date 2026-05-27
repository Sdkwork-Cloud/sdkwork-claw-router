package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class UploadPresignGrantRecord {
    private String bucketId;
    private Map<String, String> canonicalHeaders;
    private String consumedAt;
    private String createdAt;
    private String expiresAt;
    private String id;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String method;
    private String objectKey;
    private String organizationId;
    private String payloadHash;
    private String providerId;
    private String requestId;
    private String retentionUntil;
    private Map<String, String> signedHeaders;
    private String status;
    private String tenantId;
    private String traceId;
    private String uploadPartId;
    private String uploadSessionId;
    private String userId;
    private String uuid;

    public String getBucketId() {
        return this.bucketId;
    }

    public void setBucketId(String bucketId) {
        this.bucketId = bucketId;
    }

    public Map<String, String> getCanonicalHeaders() {
        return this.canonicalHeaders;
    }

    public void setCanonicalHeaders(Map<String, String> canonicalHeaders) {
        this.canonicalHeaders = canonicalHeaders;
    }

    public String getConsumedAt() {
        return this.consumedAt;
    }

    public void setConsumedAt(String consumedAt) {
        this.consumedAt = consumedAt;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
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

    public String getMethod() {
        return this.method;
    }

    public void setMethod(String method) {
        this.method = method;
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

    public String getRetentionUntil() {
        return this.retentionUntil;
    }

    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public Map<String, String> getSignedHeaders() {
        return this.signedHeaders;
    }

    public void setSignedHeaders(Map<String, String> signedHeaders) {
        this.signedHeaders = signedHeaders;
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

    public String getUploadPartId() {
        return this.uploadPartId;
    }

    public void setUploadPartId(String uploadPartId) {
        this.uploadPartId = uploadPartId;
    }

    public String getUploadSessionId() {
        return this.uploadSessionId;
    }

    public void setUploadSessionId(String uploadSessionId) {
        this.uploadSessionId = uploadSessionId;
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
