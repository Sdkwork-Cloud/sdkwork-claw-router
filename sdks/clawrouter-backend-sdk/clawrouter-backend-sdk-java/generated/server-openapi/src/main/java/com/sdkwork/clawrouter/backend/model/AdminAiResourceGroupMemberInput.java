package com.sdkwork.clawrouter.backend.model;


public class AdminAiResourceGroupMemberInput {
    private String itemRole;
    private String resourceCode;
    private Integer sortOrder;

    public String getItemRole() {
        return this.itemRole;
    }

    public void setItemRole(String itemRole) {
        this.itemRole = itemRole;
    }

    public String getResourceCode() {
        return this.resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
