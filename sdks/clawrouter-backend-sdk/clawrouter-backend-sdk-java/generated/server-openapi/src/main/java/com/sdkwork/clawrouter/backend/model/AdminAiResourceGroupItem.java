package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAiResourceGroupItem {
    private List<String> capabilities;
    private String capability;
    private String description;
    private Boolean dynamic;
    private String groupCode;
    private String groupName;
    private String groupType;
    private String id;
    private Integer resourceCount;
    private String selectionMode;
    private Integer sortOrder;
    private String status;
    private List<String> vendorCodes;

    public List<String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getCapability() {
        return this.capability;
    }

    public void setCapability(String capability) {
        this.capability = capability;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getDynamic() {
        return this.dynamic;
    }

    public void setDynamic(Boolean dynamic) {
        this.dynamic = dynamic;
    }

    public String getGroupCode() {
        return this.groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupType() {
        return this.groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getResourceCount() {
        return this.resourceCount;
    }

    public void setResourceCount(Integer resourceCount) {
        this.resourceCount = resourceCount;
    }

    public String getSelectionMode() {
        return this.selectionMode;
    }

    public void setSelectionMode(String selectionMode) {
        this.selectionMode = selectionMode;
    }

    public Integer getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getVendorCodes() {
        return this.vendorCodes;
    }

    public void setVendorCodes(List<String> vendorCodes) {
        this.vendorCodes = vendorCodes;
    }
}
