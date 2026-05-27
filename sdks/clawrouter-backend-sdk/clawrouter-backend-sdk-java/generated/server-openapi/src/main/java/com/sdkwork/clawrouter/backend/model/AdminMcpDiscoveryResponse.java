package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminMcpDiscoveryResponse {
    private String checkedAt;
    private Integer discoveredCount;
    private Integer serverId;
    private List<AdminMcpToolItem> tools;

    public String getCheckedAt() {
        return this.checkedAt;
    }

    public void setCheckedAt(String checkedAt) {
        this.checkedAt = checkedAt;
    }

    public Integer getDiscoveredCount() {
        return this.discoveredCount;
    }

    public void setDiscoveredCount(Integer discoveredCount) {
        this.discoveredCount = discoveredCount;
    }

    public Integer getServerId() {
        return this.serverId;
    }

    public void setServerId(Integer serverId) {
        this.serverId = serverId;
    }

    public List<AdminMcpToolItem> getTools() {
        return this.tools;
    }

    public void setTools(List<AdminMcpToolItem> tools) {
        this.tools = tools;
    }
}
