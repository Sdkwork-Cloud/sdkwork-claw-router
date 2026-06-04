package com.sdkwork.clawrouter.app.model;


public class RoutingCircuitBreakerPolicy {
    private Integer failureThreshold;

    public Integer getFailureThreshold() {
        return this.failureThreshold;
    }

    public void setFailureThreshold(Integer failureThreshold) {
        this.failureThreshold = failureThreshold;
    }
}
