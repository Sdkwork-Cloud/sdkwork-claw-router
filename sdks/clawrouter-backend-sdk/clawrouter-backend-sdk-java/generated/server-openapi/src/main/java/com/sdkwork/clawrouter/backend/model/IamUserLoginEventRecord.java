package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IamUserLoginEventRecord {
    private String authMethod;
    private String authProvider;
    private String clientIpHash;
    private String clientIpMasked;
    private String clientIpRegion;
    private String createdAt;
    private String deviceFingerprintHash;
    private String deviceLabel;
    private String failureReasonCode;
    private String id;
    private Boolean legalHold;
    private String loginResult;
    private Map<String, String> metadata;
    private Boolean mfaVerified;
    private String occurredAt;
    private String organizationId;
    private String payloadHash;
    private String requestId;
    private String retentionUntil;
    private String riskLevel;
    private String sessionIdHash;
    private String status;
    private String tenantId;
    private String traceId;
    private String userAgentHash;
    private String userId;
    private String uuid;

    public String getAuthMethod() {
        return this.authMethod;
    }

    public void setAuthMethod(String authMethod) {
        this.authMethod = authMethod;
    }

    public String getAuthProvider() {
        return this.authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getClientIpHash() {
        return this.clientIpHash;
    }

    public void setClientIpHash(String clientIpHash) {
        this.clientIpHash = clientIpHash;
    }

    public String getClientIpMasked() {
        return this.clientIpMasked;
    }

    public void setClientIpMasked(String clientIpMasked) {
        this.clientIpMasked = clientIpMasked;
    }

    public String getClientIpRegion() {
        return this.clientIpRegion;
    }

    public void setClientIpRegion(String clientIpRegion) {
        this.clientIpRegion = clientIpRegion;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDeviceFingerprintHash() {
        return this.deviceFingerprintHash;
    }

    public void setDeviceFingerprintHash(String deviceFingerprintHash) {
        this.deviceFingerprintHash = deviceFingerprintHash;
    }

    public String getDeviceLabel() {
        return this.deviceLabel;
    }

    public void setDeviceLabel(String deviceLabel) {
        this.deviceLabel = deviceLabel;
    }

    public String getFailureReasonCode() {
        return this.failureReasonCode;
    }

    public void setFailureReasonCode(String failureReasonCode) {
        this.failureReasonCode = failureReasonCode;
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

    public String getLoginResult() {
        return this.loginResult;
    }

    public void setLoginResult(String loginResult) {
        this.loginResult = loginResult;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public Boolean getMfaVerified() {
        return this.mfaVerified;
    }

    public void setMfaVerified(Boolean mfaVerified) {
        this.mfaVerified = mfaVerified;
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

    public String getRetentionUntil() {
        return this.retentionUntil;
    }

    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
    }

    public String getRiskLevel() {
        return this.riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getSessionIdHash() {
        return this.sessionIdHash;
    }

    public void setSessionIdHash(String sessionIdHash) {
        this.sessionIdHash = sessionIdHash;
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
