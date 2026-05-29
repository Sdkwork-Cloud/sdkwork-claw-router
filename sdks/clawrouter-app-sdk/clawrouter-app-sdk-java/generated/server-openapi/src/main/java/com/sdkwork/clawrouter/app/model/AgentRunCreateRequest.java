package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AgentRunCreateRequest {
    private String agentId;
    private String agentVersionId;
    private String executionMode;
    private String inputMessage;
    private String memorySpaceId;
    private Map<String, String> metadata;
    private String model;
    private String runtime;
    private String sourceSurface;
    private String traceId;

    public String getAgentId() {
        return this.agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public String getAgentVersionId() {
        return this.agentVersionId;
    }

    public void setAgentVersionId(String agentVersionId) {
        this.agentVersionId = agentVersionId;
    }

    public String getExecutionMode() {
        return this.executionMode;
    }

    public void setExecutionMode(String executionMode) {
        this.executionMode = executionMode;
    }

    public String getInputMessage() {
        return this.inputMessage;
    }

    public void setInputMessage(String inputMessage) {
        this.inputMessage = inputMessage;
    }

    public String getMemorySpaceId() {
        return this.memorySpaceId;
    }

    public void setMemorySpaceId(String memorySpaceId) {
        this.memorySpaceId = memorySpaceId;
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

    public String getRuntime() {
        return this.runtime;
    }

    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public String getSourceSurface() {
        return this.sourceSurface;
    }

    public void setSourceSurface(String sourceSurface) {
        this.sourceSurface = sourceSurface;
    }

    public String getTraceId() {
        return this.traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }
}
