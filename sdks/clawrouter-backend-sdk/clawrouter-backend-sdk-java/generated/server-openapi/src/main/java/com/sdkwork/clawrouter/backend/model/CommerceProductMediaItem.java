package com.sdkwork.clawrouter.backend.model;


public class CommerceProductMediaItem {
    private String altText;
    private String id;
    private String mediaRole;
    private String ownerId;
    private String ownerType;
    private MediaResource resource;
    private Integer sortOrder;
    private String status;

    public String getAltText() {
        return this.altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMediaRole() {
        return this.mediaRole;
    }

    public void setMediaRole(String mediaRole) {
        this.mediaRole = mediaRole;
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

    public MediaResource getResource() {
        return this.resource;
    }

    public void setResource(MediaResource resource) {
        this.resource = resource;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
