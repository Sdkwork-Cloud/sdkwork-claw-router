package com.sdkwork.clawrouter.backend.model;


public class CommerceMembershipPackageGroupMutationRequest {
    private String billingCycle;
    private String code;
    private String description;
    private String durationDays;
    private String name;
    private String sortWeight;
    private String status;

    public String getBillingCycle() {
        return this.billingCycle;
    }

    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDurationDays() {
        return this.durationDays;
    }

    public void setDurationDays(String durationDays) {
        this.durationDays = durationDays;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSortWeight() {
        return this.sortWeight;
    }

    public void setSortWeight(String sortWeight) {
        this.sortWeight = sortWeight;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
