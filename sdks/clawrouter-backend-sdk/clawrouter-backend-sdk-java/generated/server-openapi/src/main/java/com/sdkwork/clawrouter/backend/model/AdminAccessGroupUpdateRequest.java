package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminAccessGroupUpdateRequest {
    private String billingType;
    private Map<String, Object> capacity;
    private String name;
    private String platform;
    private Double rateMultiplier;
    private String status;
    private String type;

    public String getBillingType() {
        return this.billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public Map<String, Object> getCapacity() {
        return this.capacity;
    }

    public void setCapacity(Map<String, Object> capacity) {
        this.capacity = capacity;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlatform() {
        return this.platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Double getRateMultiplier() {
        return this.rateMultiplier;
    }

    public void setRateMultiplier(Double rateMultiplier) {
        this.rateMultiplier = rateMultiplier;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
