package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AgentRunStepCompleteRequest {
    private String errorMessageMasked;
    private Map<String, String> metadata;
    private Map<String, String> outputJson;
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

    public Map<String, String> getOutputJson() {
        return this.outputJson;
    }

    public void setOutputJson(Map<String, String> outputJson) {
        this.outputJson = outputJson;
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
