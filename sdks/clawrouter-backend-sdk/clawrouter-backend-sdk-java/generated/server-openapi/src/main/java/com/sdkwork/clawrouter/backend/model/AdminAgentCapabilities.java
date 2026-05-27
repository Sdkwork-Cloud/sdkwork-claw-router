package com.sdkwork.clawrouter.backend.model;


public class AdminAgentCapabilities {
    private Integer mcpServerCount;
    private Boolean memoryEnabled;
    private Integer skillBindingCount;

    public Integer getMcpServerCount() {
        return this.mcpServerCount;
    }

    public void setMcpServerCount(Integer mcpServerCount) {
        this.mcpServerCount = mcpServerCount;
    }

    public Boolean getMemoryEnabled() {
        return this.memoryEnabled;
    }

    public void setMemoryEnabled(Boolean memoryEnabled) {
        this.memoryEnabled = memoryEnabled;
    }

    public Integer getSkillBindingCount() {
        return this.skillBindingCount;
    }

    public void setSkillBindingCount(Integer skillBindingCount) {
        this.skillBindingCount = skillBindingCount;
    }
}
