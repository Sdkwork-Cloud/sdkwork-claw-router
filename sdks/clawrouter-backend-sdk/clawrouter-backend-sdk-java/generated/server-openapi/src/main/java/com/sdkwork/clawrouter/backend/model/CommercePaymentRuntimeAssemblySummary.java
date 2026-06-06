package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentRuntimeAssemblySummary {
    private String failed;
    private List<String> failedProviderCodes;
    private String registered;
    private List<String> registeredProviderCodes;
    private String skipped;
    private List<String> skippedProviderCodes;
    private String total;

    public String getFailed() {
        return this.failed;
    }

    public void setFailed(String failed) {
        this.failed = failed;
    }

    public List<String> getFailedProviderCodes() {
        return this.failedProviderCodes;
    }

    public void setFailedProviderCodes(List<String> failedProviderCodes) {
        this.failedProviderCodes = failedProviderCodes;
    }

    public String getRegistered() {
        return this.registered;
    }

    public void setRegistered(String registered) {
        this.registered = registered;
    }

    public List<String> getRegisteredProviderCodes() {
        return this.registeredProviderCodes;
    }

    public void setRegisteredProviderCodes(List<String> registeredProviderCodes) {
        this.registeredProviderCodes = registeredProviderCodes;
    }

    public String getSkipped() {
        return this.skipped;
    }

    public void setSkipped(String skipped) {
        this.skipped = skipped;
    }

    public List<String> getSkippedProviderCodes() {
        return this.skippedProviderCodes;
    }

    public void setSkippedProviderCodes(List<String> skippedProviderCodes) {
        this.skippedProviderCodes = skippedProviderCodes;
    }

    public String getTotal() {
        return this.total;
    }

    public void setTotal(String total) {
        this.total = total;
    }
}
