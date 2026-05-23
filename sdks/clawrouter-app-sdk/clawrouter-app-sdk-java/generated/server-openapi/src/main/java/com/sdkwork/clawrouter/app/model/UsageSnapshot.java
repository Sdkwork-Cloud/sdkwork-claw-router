package com.sdkwork.clawrouter.app.model;


public class UsageSnapshot {
    private Integer cachedTokens;
    private Integer inputTokens;
    private Integer outputTokens;
    private Integer totalTokens;

    public Integer getCachedTokens() {
        return this.cachedTokens;
    }

    public void setCachedTokens(Integer cachedTokens) {
        this.cachedTokens = cachedTokens;
    }

    public Integer getInputTokens() {
        return this.inputTokens;
    }

    public void setInputTokens(Integer inputTokens) {
        this.inputTokens = inputTokens;
    }

    public Integer getOutputTokens() {
        return this.outputTokens;
    }

    public void setOutputTokens(Integer outputTokens) {
        this.outputTokens = outputTokens;
    }

    public Integer getTotalTokens() {
        return this.totalTokens;
    }

    public void setTotalTokens(Integer totalTokens) {
        this.totalTokens = totalTokens;
    }
}
