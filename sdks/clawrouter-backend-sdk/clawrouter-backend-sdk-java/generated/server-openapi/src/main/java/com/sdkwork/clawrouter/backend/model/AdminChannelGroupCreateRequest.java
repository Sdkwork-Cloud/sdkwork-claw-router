package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminChannelGroupCreateRequest {
    private Map<String, Object> capacity;
    private String groupCode;
    private String groupName;
    private String groupType;
    private Double officialPriceMultiplier;
    private String priceReferenceMode;
    private Double rateMultiplier;
    private String status;

    public Map<String, Object> getCapacity() {
        return this.capacity;
    }

    public void setCapacity(Map<String, Object> capacity) {
        this.capacity = capacity;
    }

    public String getGroupCode() {
        return this.groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getGroupName() {
        return this.groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupType() {
        return this.groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public Double getOfficialPriceMultiplier() {
        return this.officialPriceMultiplier;
    }

    public void setOfficialPriceMultiplier(Double officialPriceMultiplier) {
        this.officialPriceMultiplier = officialPriceMultiplier;
    }

    public String getPriceReferenceMode() {
        return this.priceReferenceMode;
    }

    public void setPriceReferenceMode(String priceReferenceMode) {
        this.priceReferenceMode = priceReferenceMode;
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
}
