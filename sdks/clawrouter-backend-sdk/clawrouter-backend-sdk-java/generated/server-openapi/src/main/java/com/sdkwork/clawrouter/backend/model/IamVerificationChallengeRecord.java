package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IamVerificationChallengeRecord {
    private String consumedAt;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String deliveryRequestId;
    private String id;
    private String lockedUntil;
    private Map<String, String> metadata;
    private String organizationId;
    private String saltRef;
    private String status;
    private String targetMasked;
    private String tenantId;
    private String updatedAt;
    private String userId;
    private String uuid;
    private String verifiedAt;
    private String version;

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

    public String getDeliveryRequestId() {
        return this.deliveryRequestId;
    }

    public void setDeliveryRequestId(String deliveryRequestId) {
        this.deliveryRequestId = deliveryRequestId;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLockedUntil() {
        return this.lockedUntil;
    }

    public void setLockedUntil(String lockedUntil) {
        this.lockedUntil = lockedUntil;
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

    public String getSaltRef() {
        return this.saltRef;
    }

    public void setSaltRef(String saltRef) {
        this.saltRef = saltRef;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetMasked() {
        return this.targetMasked;
    }

    public void setTargetMasked(String targetMasked) {
        this.targetMasked = targetMasked;
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

    public String getVerifiedAt() {
        return this.verifiedAt;
    }

    public void setVerifiedAt(String verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
