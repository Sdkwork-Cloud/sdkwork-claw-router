package com.sdkwork.clawrouter.backend.model;


public class CommerceMembershipPackageMutationRequest {
    private String code;
    private String currencyCode;
    private String durationDays;
    private String name;
    private String packageGroupId;
    private String planId;
    private String priceAmount;
    private String status;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
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

    public String getPackageGroupId() {
        return this.packageGroupId;
    }

    public void setPackageGroupId(String packageGroupId) {
        this.packageGroupId = packageGroupId;
    }

    public String getPlanId() {
        return this.planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getPriceAmount() {
        return this.priceAmount;
    }

    public void setPriceAmount(String priceAmount) {
        this.priceAmount = priceAmount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
