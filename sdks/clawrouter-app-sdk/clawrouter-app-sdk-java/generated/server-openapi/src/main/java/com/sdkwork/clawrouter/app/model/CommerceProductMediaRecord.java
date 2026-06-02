package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class CommerceProductMediaRecord {
    private String altText;
    private String createdAt;
    private String id;
    private String mediaResourceId;
    private String mediaRole;
    private String objectBlobId;
    private String organizationId;
    private String ownerId;
    private String ownerType;
    private Map<String, String> resourceSnapshot;
    private String sortOrder;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getAltText() {
        return this.altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
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

    public String getMediaResourceId() {
        return this.mediaResourceId;
    }

    public void setMediaResourceId(String mediaResourceId) {
        this.mediaResourceId = mediaResourceId;
    }

    public String getMediaRole() {
        return this.mediaRole;
    }

    public void setMediaRole(String mediaRole) {
        this.mediaRole = mediaRole;
    }

    public String getObjectBlobId() {
        return this.objectBlobId;
    }

    public void setObjectBlobId(String objectBlobId) {
        this.objectBlobId = objectBlobId;
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

    public Map<String, String> getResourceSnapshot() {
        return this.resourceSnapshot;
    }

    public void setResourceSnapshot(Map<String, String> resourceSnapshot) {
        this.resourceSnapshot = resourceSnapshot;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
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
}
