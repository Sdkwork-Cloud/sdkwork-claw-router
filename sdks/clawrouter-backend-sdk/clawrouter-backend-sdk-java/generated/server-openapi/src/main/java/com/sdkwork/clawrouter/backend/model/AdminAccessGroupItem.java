package com.sdkwork.clawrouter.backend.model;


public class AdminAccessGroupItem {
    private AdminCountPair accountCount;
    private String billingType;
    private AdminCapacityPair capacity;
    private String id;
    private String name;
    private String platform;
    private Double rateMultiplier;
    private String status;
    private String type;
    private AdminUsagePair usage;

    public AdminCountPair getAccountCount() {
        return this.accountCount;
    }

    public void setAccountCount(AdminCountPair accountCount) {
        this.accountCount = accountCount;
    }

    public String getBillingType() {
        return this.billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public AdminCapacityPair getCapacity() {
        return this.capacity;
    }

    public void setCapacity(AdminCapacityPair capacity) {
        this.capacity = capacity;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public AdminUsagePair getUsage() {
        return this.usage;
    }

    public void setUsage(AdminUsagePair usage) {
        this.usage = usage;
    }
}
