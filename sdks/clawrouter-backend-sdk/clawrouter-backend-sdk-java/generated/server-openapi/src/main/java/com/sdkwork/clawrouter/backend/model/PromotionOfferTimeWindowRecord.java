package com.sdkwork.clawrouter.backend.model;


public class PromotionOfferTimeWindowRecord {
    private String createdAt;
    private String endsAt;
    private String id;
    private String localEndTime;
    private String localStartTime;
    private String offerVersionId;
    private String organizationId;
    private String startsAt;
    private String tenantId;
    private String timezone;
    private String updatedAt;
    private Integer weekdayMask;
    private String windowType;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEndsAt() {
        return this.endsAt;
    }

    public void setEndsAt(String endsAt) {
        this.endsAt = endsAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLocalEndTime() {
        return this.localEndTime;
    }

    public void setLocalEndTime(String localEndTime) {
        this.localEndTime = localEndTime;
    }

    public String getLocalStartTime() {
        return this.localStartTime;
    }

    public void setLocalStartTime(String localStartTime) {
        this.localStartTime = localStartTime;
    }

    public String getOfferVersionId() {
        return this.offerVersionId;
    }

    public void setOfferVersionId(String offerVersionId) {
        this.offerVersionId = offerVersionId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getStartsAt() {
        return this.startsAt;
    }

    public void setStartsAt(String startsAt) {
        this.startsAt = startsAt;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTimezone() {
        return this.timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getWeekdayMask() {
        return this.weekdayMask;
    }

    public void setWeekdayMask(Integer weekdayMask) {
        this.weekdayMask = weekdayMask;
    }

    public String getWindowType() {
        return this.windowType;
    }

    public void setWindowType(String windowType) {
        this.windowType = windowType;
    }
}
