package com.sdkwork.clawrouter.app.model;


public class IamRoleBindingItem {
    private String conditionJson;
    private String createdAt;
    private String effect;
    private String id;
    private String principalId;
    private String principalKind;
    private String roleId;
    private String scopeId;
    private String scopeKind;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getConditionJson() {
        return this.conditionJson;
    }

    public void setConditionJson(String conditionJson) {
        this.conditionJson = conditionJson;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEffect() {
        return this.effect;
    }

    public void setEffect(String effect) {
        this.effect = effect;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPrincipalId() {
        return this.principalId;
    }

    public void setPrincipalId(String principalId) {
        this.principalId = principalId;
    }

    public String getPrincipalKind() {
        return this.principalKind;
    }

    public void setPrincipalKind(String principalKind) {
        this.principalKind = principalKind;
    }

    public String getRoleId() {
        return this.roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getScopeId() {
        return this.scopeId;
    }

    public void setScopeId(String scopeId) {
        this.scopeId = scopeId;
    }

    public String getScopeKind() {
        return this.scopeKind;
    }

    public void setScopeKind(String scopeKind) {
        this.scopeKind = scopeKind;
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
