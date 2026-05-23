package com.sdkwork.clawrouter.backend.model;


public class CommercePaymentRouteRuleItem {
    private String channelId;
    private String countryCode;
    private String createdAt;
    private String currencyCode;
    private String fallbackChannelId;
    private Boolean fallbackEnabled;
    private String id;
    private String methodCode;
    private Integer priority;
    private String ruleNo;
    private String sceneCode;
    private String status;
    private String updatedAt;

    public String getChannelId() {
        return this.channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getCountryCode() {
        return this.countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getFallbackChannelId() {
        return this.fallbackChannelId;
    }

    public void setFallbackChannelId(String fallbackChannelId) {
        this.fallbackChannelId = fallbackChannelId;
    }

    public Boolean getFallbackEnabled() {
        return this.fallbackEnabled;
    }

    public void setFallbackEnabled(Boolean fallbackEnabled) {
        this.fallbackEnabled = fallbackEnabled;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMethodCode() {
        return this.methodCode;
    }

    public void setMethodCode(String methodCode) {
        this.methodCode = methodCode;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getRuleNo() {
        return this.ruleNo;
    }

    public void setRuleNo(String ruleNo) {
        this.ruleNo = ruleNo;
    }

    public String getSceneCode() {
        return this.sceneCode;
    }

    public void setSceneCode(String sceneCode) {
        this.sceneCode = sceneCode;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
