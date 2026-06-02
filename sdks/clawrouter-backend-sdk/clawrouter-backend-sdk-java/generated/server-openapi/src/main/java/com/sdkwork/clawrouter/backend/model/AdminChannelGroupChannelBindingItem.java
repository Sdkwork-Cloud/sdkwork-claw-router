package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminChannelGroupChannelBindingItem {
    private List<String> capabilities;
    private String channelCode;
    private String channelGroupId;
    private String channelId;
    private String channelName;
    private String healthStatus;
    private String id;
    private List<String> modelScope;
    private List<String> models;
    private Integer priority;
    private String providerCode;
    private String providerName;
    private String status;
    private Integer weight;

    public List<String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getChannelCode() {
        return this.channelCode;
    }

    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }

    public String getChannelGroupId() {
        return this.channelGroupId;
    }

    public void setChannelGroupId(String channelGroupId) {
        this.channelGroupId = channelGroupId;
    }

    public String getChannelId() {
        return this.channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getChannelName() {
        return this.channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public String getHealthStatus() {
        return this.healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getModelScope() {
        return this.modelScope;
    }

    public void setModelScope(List<String> modelScope) {
        this.modelScope = modelScope;
    }

    public List<String> getModels() {
        return this.models;
    }

    public void setModels(List<String> models) {
        this.models = models;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getProviderName() {
        return this.providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getWeight() {
        return this.weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
