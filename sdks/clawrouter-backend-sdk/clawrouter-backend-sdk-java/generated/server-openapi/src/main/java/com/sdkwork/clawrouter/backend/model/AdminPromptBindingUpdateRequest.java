package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminPromptBindingUpdateRequest {
    private String bindingRole;
    private Boolean enabled;
    private Integer ownerId;
    private String ownerType;
    private Map<String, String> policyJson;
    private Integer priority;
    private Integer promptVersionId;

    public String getBindingRole() {
        return this.bindingRole;
    }

    public void setBindingRole(String bindingRole) {
        this.bindingRole = bindingRole;
    }

    public Boolean getEnabled() {
        return this.enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
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

    public Integer getPromptVersionId() {
        return this.promptVersionId;
    }

    public void setPromptVersionId(Integer promptVersionId) {
        this.promptVersionId = promptVersionId;
    }
}
