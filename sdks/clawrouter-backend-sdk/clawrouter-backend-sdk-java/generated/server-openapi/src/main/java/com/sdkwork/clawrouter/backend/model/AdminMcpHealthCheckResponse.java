package com.sdkwork.clawrouter.backend.model;


public class AdminMcpHealthCheckResponse {
    private String checkedAt;
    private String errorMasked;
    private String healthStatus;
    private Boolean healthy;
    private Integer latencyMs;
    private Integer serverId;

    public String getCheckedAt() {
        return this.checkedAt;
    }

    public void setCheckedAt(String checkedAt) {
        this.checkedAt = checkedAt;
    }

    public String getErrorMasked() {
        return this.errorMasked;
    }

    public void setErrorMasked(String errorMasked) {
        this.errorMasked = errorMasked;
    }

    public String getHealthStatus() {
        return this.healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Boolean getHealthy() {
        return this.healthy;
    }

    public void setHealthy(Boolean healthy) {
        this.healthy = healthy;
    }

    public Integer getLatencyMs() {
        return this.latencyMs;
    }

    public void setLatencyMs(Integer latencyMs) {
        this.latencyMs = latencyMs;
    }

    public Integer getServerId() {
        return this.serverId;
    }

    public void setServerId(Integer serverId) {
        this.serverId = serverId;
    }
}
