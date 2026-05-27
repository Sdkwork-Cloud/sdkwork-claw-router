package com.sdkwork.clawrouter.backend.model;

import java.util.List;
import java.util.Map;

public class AdminMcpBindingItem {
    private List<String> allowedTools;
    private String createdAt;
    private List<String> deniedTools;
    private Boolean enabled;
    private Integer id;
    private Integer organizationId;
    private Integer ownerId;
    private String ownerType;
    private Map<String, String> policyJson;
    private Integer priority;
    private Integer serverId;
    private Integer serverRevisionId;
    private Map<String, String> snapshotJson;
    private String status;
    private Integer tenantId;
    private Integer toolId;
    private String updatedAt;
    private String uuid;

    public List<String> getAllowedTools() {
        return this.allowedTools;
    }

    public void setAllowedTools(List<String> allowedTools) {
        this.allowedTools = allowedTools;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getDeniedTools() {
        return this.deniedTools;
    }

    public void setDeniedTools(List<String> deniedTools) {
        this.deniedTools = deniedTools;
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

    public Integer getServerId() {
        return this.serverId;
    }

    public void setServerId(Integer serverId) {
        this.serverId = serverId;
    }

    public Integer getServerRevisionId() {
        return this.serverRevisionId;
    }

    public void setServerRevisionId(Integer serverRevisionId) {
        this.serverRevisionId = serverRevisionId;
    }

    public Map<String, String> getSnapshotJson() {
        return this.snapshotJson;
    }

    public void setSnapshotJson(Map<String, String> snapshotJson) {
        this.snapshotJson = snapshotJson;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public Integer getToolId() {
        return this.toolId;
    }

    public void setToolId(Integer toolId) {
        this.toolId = toolId;
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
