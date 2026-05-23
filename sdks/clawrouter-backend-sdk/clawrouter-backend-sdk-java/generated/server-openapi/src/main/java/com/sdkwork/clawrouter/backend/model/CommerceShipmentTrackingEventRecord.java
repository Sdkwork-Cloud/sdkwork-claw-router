package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommerceShipmentTrackingEventRecord {
    private String createdAt;
    private String description;
    private String eventCode;
    private String eventTime;
    private String location;
    private String organizationId;
    private Map<String, String> rawPayloadJson;
    private String shipmentId;
    private String tenantId;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventCode() {
        return this.eventCode;
    }

    public void setEventCode(String eventCode) {
        this.eventCode = eventCode;
    }

    public String getEventTime() {
        return this.eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getRawPayloadJson() {
        return this.rawPayloadJson;
    }

    public void setRawPayloadJson(Map<String, String> rawPayloadJson) {
        this.rawPayloadJson = rawPayloadJson;
    }

    public String getShipmentId() {
        return this.shipmentId;
    }

    public void setShipmentId(String shipmentId) {
        this.shipmentId = shipmentId;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
