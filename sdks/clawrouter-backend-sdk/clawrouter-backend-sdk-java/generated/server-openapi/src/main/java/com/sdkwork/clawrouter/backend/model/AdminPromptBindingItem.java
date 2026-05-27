package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminPromptBindingItem {
    private String bindingRole;
    private String createdAt;
    private Boolean enabled;
    private Integer id;
    private Integer organizationId;
    private Integer ownerId;
    private String ownerType;
    private Map<String, String> policyJson;
    private Integer priority;
    private Integer promptId;
    private Integer promptVersionId;
    private Map<String, String> snapshotJson;
    private Integer tenantId;
    private String updatedAt;
    private String uuid;

    public String getBindingRole() {
        return this.bindingRole;
    }

    public void setBindingRole(String bindingRole) {
        this.bindingRole = bindingRole;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getEnabled() {
        return this.enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(Integer organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getOwnerId() {
        return this.ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerType() {
        return this.ownerType;
    }

    public void setOwnerType(String ownerType) {
        this.ownerType = ownerType;
    }

    public Map<String, String> getPolicyJson() {
        return this.policyJson;
    }

    public void setPolicyJson(Map<String, String> policyJson) {
        this.policyJson = policyJson;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getPromptId() {
        return this.promptId;
    }

    public void setPromptId(Integer promptId) {
        this.promptId = promptId;
    }

    public Integer getPromptVersionId() {
        return this.promptVersionId;
    }

    public void setPromptVersionId(Integer promptVersionId) {
        this.promptVersionId = promptVersionId;
    }

    public Map<String, String> getSnapshotJson() {
        return this.snapshotJson;
    }

    public void setSnapshotJson(Map<String, String> snapshotJson) {
        this.snapshotJson = snapshotJson;
    }

    public Integer getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
