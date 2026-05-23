package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AgentRunCompleteRequest {
    private String errorMessageMasked;
    private Map<String, String> metadata;
    private String outputMessage;
    private String status;
    private UsageSnapshot usageJson;

    public String getErrorMessageMasked() {
        return this.errorMessageMasked;
    }

    public void setErrorMessageMasked(String errorMessageMasked) {
        this.errorMessageMasked = errorMessageMasked;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getOutputMessage() {
        return this.outputMessage;
    }

    public void setOutputMessage(String outputMessage) {
        this.outputMessage = outputMessage;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UsageSnapshot getUsageJson() {
        return this.usageJson;
    }

    public void setUsageJson(UsageSnapshot usageJson) {
        this.usageJson = usageJson;
    }
}
