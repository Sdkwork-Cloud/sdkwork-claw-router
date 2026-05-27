package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IamUserSecuritySettingRecord {
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String id;
    private String lastLoginAt;
    private String lastLoginIpHash;
    private Map<String, String> metadata;
    private Boolean mfaEnabled;
    private String mfaMethod;
    private String organizationId;
    private String ownerId;
    private String ownerType;
    private String passwordLastChangedAt;
    private String securityLevel;
    private String status;
    private String tenantId;
    private Map<String, String> thirdPartyBoundSnapshot;
    private Integer trustedDeviceCount;
    private String updatedAt;
    private String userId;
    private String uuid;
    private String version;

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

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastLoginAt() {
        return this.lastLoginAt;
    }

    public void setLastLoginAt(String lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public String getLastLoginIpHash() {
        return this.lastLoginIpHash;
    }

    public void setLastLoginIpHash(String lastLoginIpHash) {
        this.lastLoginIpHash = lastLoginIpHash;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public Boolean getMfaEnabled() {
        return this.mfaEnabled;
    }

    public void setMfaEnabled(Boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public String getMfaMethod() {
        return this.mfaMethod;
    }

    public void setMfaMethod(String mfaMethod) {
        this.mfaMethod = mfaMethod;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getOwnerId() {
        return this.ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerType() {
        return this.ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public String getPasswordLastChangedAt() {
        return this.passwordLastChangedAt;
    }

    public void setPasswordLastChangedAt(String passwordLastChangedAt) {
        this.passwordLastChangedAt = passwordLastChangedAt;
    }

    public String getSecurityLevel() {
        return this.securityLevel;
    }

    public void setSecurityLevel(String securityLevel) {
        this.securityLevel = securityLevel;
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

    public Map<String, String> getThirdPartyBoundSnapshot() {
        return this.thirdPartyBoundSnapshot;
    }

    public void setThirdPartyBoundSnapshot(Map<String, String> thirdPartyBoundSnapshot) {
        this.thirdPartyBoundSnapshot = thirdPartyBoundSnapshot;
    }

    public Integer getTrustedDeviceCount() {
        return this.trustedDeviceCount;
    }

    public void setTrustedDeviceCount(Integer trustedDeviceCount) {
        this.trustedDeviceCount = trustedDeviceCount;
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

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
