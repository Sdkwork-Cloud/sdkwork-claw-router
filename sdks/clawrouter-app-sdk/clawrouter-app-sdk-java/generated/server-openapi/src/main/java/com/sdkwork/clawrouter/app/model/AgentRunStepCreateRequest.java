package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AgentRunStepCreateRequest {
    private Map<String, String> inputJson;
    private Map<String, String> metadata;
    private String model;
    private Map<String, String> outputJson;
    private String runtimeInvocationId;
    private String status;
    private String stepType;
    private String title;
    private String toolName;
    private UsageSnapshot usageJson;

    public Map<String, String> getInputJson() {
        return this.inputJson;
    }

    public void setInputJson(Map<String, String> inputJson) {
        this.inputJson = inputJson;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Map<String, String> getOutputJson() {
        return this.outputJson;
    }

    public void setOutputJson(Map<String, String> outputJson) {
        this.outputJson = outputJson;
    }

    public String getRuntimeInvocationId() {
        return this.runtimeInvocationId;
    }

    public void setRuntimeInvocationId(String runtimeInvocationId) {
        this.runtimeInvocationId = runtimeInvocationId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStepType() {
        return this.stepType;
    }

    public void setStepType(String stepType) {
        this.stepType = stepType;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getToolName() {
        return this.toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }

    public UsageSnapshot getUsageJson() {
        return this.usageJson;
    }

    public void setUsageJson(UsageSnapshot usageJson) {
        this.usageJson = usageJson;
    }
}
