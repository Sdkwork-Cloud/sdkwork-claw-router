package com.sdkwork.clawrouter.backend.model;


public class AdminChannelEndpointUpdateRequest {
    private String apiEndpointCode;
    private String baseUrl;
    private String effectiveFrom;
    private String effectiveTo;
    private Integer priority;
    private String regionCode;
    private String status;
    private String vendorCode;
    private Integer weight;

    public String getApiEndpointCode() {
        return this.apiEndpointCode;
    }

    public void setApiEndpointCode(String apiEndpointCode) {
        this.apiEndpointCode = apiEndpointCode;
    }

    public String getBaseUrl() {
        return this.baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getEffectiveFrom() {
        return this.effectiveFrom;
    }

    public void setEffectiveFrom(String effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public String getEffectiveTo() {
        return this.effectiveTo;
    }

    public void setEffectiveTo(String effectiveTo) {
        this.effectiveTo = effectiveTo;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getRegionCode() {
        return this.regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVendorCode() {
        return this.vendorCode;
    }

    public void setVendorCode(String vendorCode) {
        this.vendorCode = vendorCode;
    }

    public Integer getWeight() {
        return this.weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
