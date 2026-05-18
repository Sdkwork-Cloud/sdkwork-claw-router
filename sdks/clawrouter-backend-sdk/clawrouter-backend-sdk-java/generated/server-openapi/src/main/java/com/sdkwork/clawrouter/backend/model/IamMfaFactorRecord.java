package com.sdkwork.clawrouter.backend.model;


public class IamMfaFactorRecord {
    private String createdAt;
    private String factorType;
    private String id;
    private String secretRef;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String userId;

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFactorType() {
        return this.factorType;
    }
    
    public void setFactorType(String factorType) {
        this.factorType = factorType;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getSecretRef() {
        return this.secretRef;
    }
    
    public void setSecretRef(String secretRef) {
        this.secretRef = secretRef;
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
