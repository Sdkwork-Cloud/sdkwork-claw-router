package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AgentCreateRequest {
    private String code;
    private String description;
    private Map<String, String> mcpPolicy;
    private Map<String, String> memoryPolicy;
    private String model;
    private String name;
    private Map<String, String> runtimePolicy;
    private Map<String, String> skillPolicy;
    private String systemPrompt;
    private Map<String, String> toolPolicy;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
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
}
