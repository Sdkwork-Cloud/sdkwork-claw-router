package com.sdkwork.clawrouter.app.model;


public class IamDepartmentAssignmentItem {
    private String assignmentKind;
    private String createdAt;
    private String departmentId;
    private String effectiveFrom;
    private String effectiveTo;
    private String id;
    private Boolean isPrimary;
    private String organizationId;
    private String organizationMembershipId;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String userId;

    public String getAssignmentKind() {
        return this.assignmentKind;
    }

    public void setAssignmentKind(String assignmentKind) {
        this.assignmentKind = assignmentKind;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDepartmentId() {
        return this.departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getEffectiveFrom() {
        return this.effectiveFrom;
    }

    public void setEffectiveFrom(String effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public String getEffectiveTo() {
        return this.effectiveTo;
    }

    public void setEffectiveTo(String effectiveTo) {
        this.effectiveTo = effectiveTo;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getIsPrimary() {
        return this.isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getOrganizationMembershipId() {
        return this.organizationMembershipId;
    }

    public void setOrganizationMembershipId(String organizationMembershipId) {
        this.organizationMembershipId = organizationMembershipId;
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

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
