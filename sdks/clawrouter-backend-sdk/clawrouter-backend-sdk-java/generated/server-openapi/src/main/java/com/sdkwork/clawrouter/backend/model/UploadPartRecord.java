package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class UploadPartRecord {
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String id;
    private Map<String, String> metadata;
    private String organizationId;
    private String partEtag;
    private Integer partNumber;
    private String partSha256;
    private String presignedUrlExpiresAt;
    private String sizeBytes;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String uploadSessionId;
    private String uploadedAt;
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

    public String getPartEtag() {
        return this.partEtag;
    }

    public void setPartEtag(String partEtag) {
        this.partEtag = partEtag;
    }

    public Integer getPartNumber() {
        return this.partNumber;
    }

    public void setPartNumber(Integer partNumber) {
        this.partNumber = partNumber;
    }

    public String getPartSha256() {
        return this.partSha256;
    }

    public void setPartSha256(String partSha256) {
        this.partSha256 = partSha256;
    }

    public String getPresignedUrlExpiresAt() {
        return this.presignedUrlExpiresAt;
    }

    public void setPresignedUrlExpiresAt(String presignedUrlExpiresAt) {
        this.presignedUrlExpiresAt = presignedUrlExpiresAt;
    }

    public String getSizeBytes() {
        return this.sizeBytes;
    }

    public void setSizeBytes(String sizeBytes) {
        this.sizeBytes = sizeBytes;
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

    public String getUploadSessionId() {
        return this.uploadSessionId;
    }

    public void setUploadSessionId(String uploadSessionId) {
        this.uploadSessionId = uploadSessionId;
    }

    public String getUploadedAt() {
        return this.uploadedAt;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
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
