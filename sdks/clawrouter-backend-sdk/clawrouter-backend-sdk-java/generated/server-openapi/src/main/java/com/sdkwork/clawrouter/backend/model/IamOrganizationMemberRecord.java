package com.sdkwork.clawrouter.backend.model;


public class IamOrganizationMemberRecord {
    private String id;
    private String joinedAt;
    private String organizationId;
    private String roleCode;
    private String status;
    private String tenantId;
    private String userId;

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getJoinedAt() {
        return this.joinedAt;
    }
    
    public void setJoinedAt(String joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getRoleCode() {
        return this.roleCode;
    }
    
    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
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

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
