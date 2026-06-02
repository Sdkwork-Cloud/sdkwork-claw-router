package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentRuntimeAssemblySummary {
    private Integer failed;
    private List<String> failedProviderCodes;
    private Integer registered;
    private List<String> registeredProviderCodes;
    private Integer skipped;
    private List<String> skippedProviderCodes;
    private Integer total;

    public Integer getFailed() {
        return this.failed;
    }

    public void setFailed(Integer failed) {
        this.failed = failed;
    }

    public List<String> getFailedProviderCodes() {
        return this.failedProviderCodes;
    }

    public void setFailedProviderCodes(List<String> failedProviderCodes) {
        this.failedProviderCodes = failedProviderCodes;
    }

    public Integer getRegistered() {
        return this.registered;
    }

    public void setRegistered(Integer registered) {
        this.registered = registered;
    }

    public List<String> getRegisteredProviderCodes() {
        return this.registeredProviderCodes;
    }

    public void setRegisteredProviderCodes(List<String> registeredProviderCodes) {
        this.registeredProviderCodes = registeredProviderCodes;
    }

    public Integer getSkipped() {
        return this.skipped;
    }

    public void setSkipped(Integer skipped) {
        this.skipped = skipped;
    }

    public List<String> getSkippedProviderCodes() {
        return this.skippedProviderCodes;
    }

    public void setSkippedProviderCodes(List<String> skippedProviderCodes) {
        this.skippedProviderCodes = skippedProviderCodes;
    }

    public Integer getTotal() {
        return this.total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
