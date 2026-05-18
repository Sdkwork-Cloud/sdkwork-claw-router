package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class IamPolicyRecord {
    private String code;
    private String createdAt;
    private String id;
    private String name;
    private Map<String, String> policyJson;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
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

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public Map<String, String> getPolicyJson() {
        return this.policyJson;
    }
    
    public void setPolicyJson(Map<String, String> policyJson) {
        this.policyJson = policyJson;
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
