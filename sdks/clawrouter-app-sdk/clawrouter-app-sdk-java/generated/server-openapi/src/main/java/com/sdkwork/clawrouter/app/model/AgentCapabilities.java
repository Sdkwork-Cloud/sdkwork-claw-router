package com.sdkwork.clawrouter.app.model;


public class AgentCapabilities {
    private String mcpServerCount;
    private Boolean memoryEnabled;
    private String skillBindingCount;

    public String getMcpServerCount() {
        return this.mcpServerCount;
    }

    public void setMcpServerCount(String mcpServerCount) {
        this.mcpServerCount = mcpServerCount;
    }

    public Boolean getMemoryEnabled() {
        return this.memoryEnabled;
    }

    public void setMemoryEnabled(Boolean memoryEnabled) {
        this.memoryEnabled = memoryEnabled;
    }

    public String getSkillBindingCount() {
        return this.skillBindingCount;
    }

    public void setSkillBindingCount(String skillBindingCount) {
        this.skillBindingCount = skillBindingCount;
    }
}
