package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminChannelGroupChannelBindingInput {
    private List<String> capabilities;
    private String channelId;
    private List<String> modelScope;
    private Integer priority;
    private String status;
    private Integer weight;

    public List<String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getChannelId() {
        return this.channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public List<String> getModelScope() {
        return this.modelScope;
    }

    public void setModelScope(List<String> modelScope) {
        this.modelScope = modelScope;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
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
