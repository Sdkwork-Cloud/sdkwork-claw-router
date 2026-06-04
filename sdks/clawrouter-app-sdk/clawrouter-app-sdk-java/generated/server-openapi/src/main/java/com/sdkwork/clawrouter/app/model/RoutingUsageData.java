package com.sdkwork.clawrouter.app.model;


public class RoutingUsageData {
    private Integer latency;
    private Integer requests;
    private String time;

    public Integer getLatency() {
        return this.latency;
    }

    public void setLatency(Integer latency) {
        this.latency = latency;
    }

    public Integer getRequests() {
        return this.requests;
    }

    public void setRequests(Integer requests) {
        this.requests = requests;
    }

    public String getTime() {
        return this.time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
