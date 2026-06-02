package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class PromotionEventOutboxRecord {
    private String aggregateId;
    private String aggregateType;
    private String createdAt;
    private String eventNo;
    private String eventType;
    private Integer eventVersion;
    private String id;
    private String nextRetryAt;
    private String occurredAt;
    private String organizationId;
    private String payloadHash;
    private Map<String, String> payloadJson;
    private Integer publishAttempts;
    private String publishedAt;
    private String status;
    private String tenantId;

    public String getAggregateId() {
        return this.aggregateId;
    }

    public void setAggregateId(String aggregateId) {
        this.aggregateId = aggregateId;
    }

    public String getAggregateType() {
        return this.aggregateType;
    }

    public void setAggregateType(String aggregateType) {
        this.aggregateType = aggregateType;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEventNo() {
        return this.eventNo;
    }

    public void setEventNo(String eventNo) {
        this.eventNo = eventNo;
    }

    public String getEventType() {
        return this.eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Integer getEventVersion() {
        return this.eventVersion;
    }

    public void setEventVersion(Integer eventVersion) {
        this.eventVersion = eventVersion;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNextRetryAt() {
        return this.nextRetryAt;
    }

    public void setNextRetryAt(String nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public String getOccurredAt() {
        return this.occurredAt;
    }

    public void setOccurredAt(String occurredAt) {
        this.occurredAt = occurredAt;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPayloadHash() {
        return this.payloadHash;
    }

    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public Map<String, String> getPayloadJson() {
        return this.payloadJson;
    }

    public void setPayloadJson(Map<String, String> payloadJson) {
        this.payloadJson = payloadJson;
    }

    public Integer getPublishAttempts() {
        return this.publishAttempts;
    }

    public void setPublishAttempts(Integer publishAttempts) {
        this.publishAttempts = publishAttempts;
    }

    public String getPublishedAt() {
        return this.publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
