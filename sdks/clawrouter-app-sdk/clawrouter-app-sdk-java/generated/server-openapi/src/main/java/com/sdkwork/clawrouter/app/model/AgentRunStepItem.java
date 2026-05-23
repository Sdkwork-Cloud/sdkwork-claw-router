package com.sdkwork.clawrouter.app.model;


public class AgentRunStepItem {
    private Integer cachedTokens;
    private String completedAt;
    private String createdAt;
    private String id;
    private Integer inputTokens;
    private Integer latencyMs;
    private String model;
    private Integer outputTokens;
    private String runId;
    private String runtimeInvocationId;
    private String startedAt;
    private String status;
    private Integer stepIndex;
    private String stepType;
    private String title;
    private String toolName;
    private Integer totalTokens;

    public Integer getCachedTokens() {
        return this.cachedTokens;
    }

    public void setCachedTokens(Integer cachedTokens) {
        this.cachedTokens = cachedTokens;
    }

    public String getCompletedAt() {
        return this.completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getInputTokens() {
        return this.inputTokens;
    }

    public void setInputTokens(Integer inputTokens) {
        this.inputTokens = inputTokens;
    }

    public Integer getLatencyMs() {
        return this.latencyMs;
    }

    public void setLatencyMs(Integer latencyMs) {
        this.latencyMs = latencyMs;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getOutputTokens() {
        return this.outputTokens;
    }

    public void setOutputTokens(Integer outputTokens) {
        this.outputTokens = outputTokens;
    }

    public String getRunId() {
        return this.runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public String getRuntimeInvocationId() {
        return this.runtimeInvocationId;
    }

    public void setRuntimeInvocationId(String runtimeInvocationId) {
        this.runtimeInvocationId = runtimeInvocationId;
    }

    public String getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getStepIndex() {
        return this.stepIndex;
    }

    public void setStepIndex(Integer stepIndex) {
        this.stepIndex = stepIndex;
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

    public Integer getTotalTokens() {
        return this.totalTokens;
    }

    public void setTotalTokens(Integer totalTokens) {
        this.totalTokens = totalTokens;
    }
}
