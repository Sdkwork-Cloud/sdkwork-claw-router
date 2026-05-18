package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminAgentVersionItem {
    private String createdAt;
    private String id;
    private Map<String, String> mcpPolicy;
    private Map<String, String> memoryPolicy;
    private String model;
    private String releaseStatus;
    private Map<String, String> runtimePolicy;
    private Map<String, String> skillPolicy;
    private String systemPrompt;
    private Map<String, String> toolPolicy;
    private String updatedAt;
    private Integer versionNo;

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

    public Map<String, String> getMcpPolicy() {
        return this.mcpPolicy;
    }
    
    public void setMcpPolicy(Map<String, String> mcpPolicy) {
        this.mcpPolicy = mcpPolicy;
    }

    public Map<String, String> getMemoryPolicy() {
        return this.memoryPolicy;
    }
    
    public void setMemoryPolicy(Map<String, String> memoryPolicy) {
        this.memoryPolicy = memoryPolicy;
    }

    public String getModel() {
        return this.model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }

    public String getReleaseStatus() {
        return this.releaseStatus;
    }
    
    public void setReleaseStatus(String releaseStatus) {
        this.releaseStatus = releaseStatus;
    }

    public Map<String, String> getRuntimePolicy() {
        return this.runtimePolicy;
    }
    
    public void setRuntimePolicy(Map<String, String> runtimePolicy) {
        this.runtimePolicy = runtimePolicy;
    }

    public Map<String, String> getSkillPolicy() {
        return this.skillPolicy;
    }
    
    public void setSkillPolicy(Map<String, String> skillPolicy) {
        this.skillPolicy = skillPolicy;
    }

    public String getSystemPrompt() {
        return this.systemPrompt;
    }
    
    public void setSystemPrompt(String systemPrompt) {
        this.systemPrompt = systemPrompt;
    }

    public Map<String, String> getToolPolicy() {
        return this.toolPolicy;
    }
    
    public void setToolPolicy(Map<String, String> toolPolicy) {
        this.toolPolicy = toolPolicy;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getVersionNo() {
        return this.versionNo;
    }
    
    public void setVersionNo(Integer versionNo) {
        this.versionNo = versionNo;
    }
}
