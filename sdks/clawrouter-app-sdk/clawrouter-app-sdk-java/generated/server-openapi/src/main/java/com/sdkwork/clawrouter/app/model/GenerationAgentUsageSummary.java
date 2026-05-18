package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class GenerationAgentUsageSummary {
    private Integer cachedTokens;
    private Integer completionTokens;
    private List<GenerationAgentMeteringEvent> events;
    private Integer imageCount;
    private Integer promptTokens;
    private Integer totalTokens;
    private String videoSeconds;

    public Integer getCachedTokens() {
        return this.cachedTokens;
    }
    
    public void setCachedTokens(Integer cachedTokens) {
        this.cachedTokens = cachedTokens;
    }

    public Integer getCompletionTokens() {
        return this.completionTokens;
    }
    
    public void setCompletionTokens(Integer completionTokens) {
        this.completionTokens = completionTokens;
    }

    public List<GenerationAgentMeteringEvent> getEvents() {
        return this.events;
    }
    
    public void setEvents(List<GenerationAgentMeteringEvent> events) {
        this.events = events;
    }

    public Integer getImageCount() {
        return this.imageCount;
    }
    
    public void setImageCount(Integer imageCount) {
        this.imageCount = imageCount;
    }

    public Integer getPromptTokens() {
        return this.promptTokens;
    }
    
    public void setPromptTokens(Integer promptTokens) {
        this.promptTokens = promptTokens;
    }

    public Integer getTotalTokens() {
        return this.totalTokens;
    }
    
    public void setTotalTokens(Integer totalTokens) {
        this.totalTokens = totalTokens;
    }

    public String getVideoSeconds() {
        return this.videoSeconds;
    }
    
    public void setVideoSeconds(String videoSeconds) {
        this.videoSeconds = videoSeconds;
    }
}
