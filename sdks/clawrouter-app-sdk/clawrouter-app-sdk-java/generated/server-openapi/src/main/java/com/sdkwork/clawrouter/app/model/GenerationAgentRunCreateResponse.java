package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class GenerationAgentRunCreateResponse {
    private GenerationAgentSnapshot agent;
    private GenerationHistoryItem item;
    private List<GenerationAgentMeteringEvent> meteringEvents;
    private GenerationAgentRunSnapshot run;
    private String status;
    private List<GenerationAgentRunStepSnapshot> steps;
    private String targetType;
    private GenerationAgentUsageSummary usage;

    public GenerationAgentSnapshot getAgent() {
        return this.agent;
    }
    
    public void setAgent(GenerationAgentSnapshot agent) {
        this.agent = agent;
    }

    public GenerationHistoryItem getItem() {
        return this.item;
    }
    
    public void setItem(GenerationHistoryItem item) {
        this.item = item;
    }

    public List<GenerationAgentMeteringEvent> getMeteringEvents() {
        return this.meteringEvents;
    }
    
    public void setMeteringEvents(List<GenerationAgentMeteringEvent> meteringEvents) {
        this.meteringEvents = meteringEvents;
    }

    public GenerationAgentRunSnapshot getRun() {
        return this.run;
    }
    
    public void setRun(GenerationAgentRunSnapshot run) {
        this.run = run;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public List<GenerationAgentRunStepSnapshot> getSteps() {
        return this.steps;
    }
    
    public void setSteps(List<GenerationAgentRunStepSnapshot> steps) {
        this.steps = steps;
    }

    public String getTargetType() {
        return this.targetType;
    }
    
    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public GenerationAgentUsageSummary getUsage() {
        return this.usage;
    }
    
    public void setUsage(GenerationAgentUsageSummary usage) {
        this.usage = usage;
    }
}
