package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class OpsMetricSnapshotRecord {
    private String createdAt;
    private String dimensionKey;
    private String dimensionValue;
    private String id;
    private Map<String, String> metadata;
    private String metricName;
    private String metricPeriod;
    private String metricScope;
    private String metricUnit;
    private String metricValue;
    private String organizationId;
    private Map<String, String> payload;
    private String periodEnd;
    private String periodStart;
    private String rebuildVersion;
    private String sourceId;
    private String sourceType;
    private String sourceVersion;
    private String status;
    private String tenantId;
    private String updatedAt;
    private String uuid;

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDimensionKey() {
        return this.dimensionKey;
    }
    
    public void setDimensionKey(String dimensionKey) {
        this.dimensionKey = dimensionKey;
    }

    public String getDimensionValue() {
        return this.dimensionValue;
    }
    
    public void setDimensionValue(String dimensionValue) {
        this.dimensionValue = dimensionValue;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getMetricName() {
        return this.metricName;
    }
    
    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public String getMetricPeriod() {
        return this.metricPeriod;
    }
    
    public void setMetricPeriod(String metricPeriod) {
        this.metricPeriod = metricPeriod;
    }

    public String getMetricScope() {
        return this.metricScope;
    }
    
    public void setMetricScope(String metricScope) {
        this.metricScope = metricScope;
    }

    public String getMetricUnit() {
        return this.metricUnit;
    }
    
    public void setMetricUnit(String metricUnit) {
        this.metricUnit = metricUnit;
    }

    public String getMetricValue() {
        return this.metricValue;
    }
    
    public void setMetricValue(String metricValue) {
        this.metricValue = metricValue;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getPayload() {
        return this.payload;
    }
    
    public void setPayload(Map<String, String> payload) {
        this.payload = payload;
    }

    public String getPeriodEnd() {
        return this.periodEnd;
    }
    
    public void setPeriodEnd(String periodEnd) {
        this.periodEnd = periodEnd;
    }

    public String getPeriodStart() {
        return this.periodStart;
    }
    
    public void setPeriodStart(String periodStart) {
        this.periodStart = periodStart;
    }

    public String getRebuildVersion() {
        return this.rebuildVersion;
    }
    
    public void setRebuildVersion(String rebuildVersion) {
        this.rebuildVersion = rebuildVersion;
    }

    public String getSourceId() {
        return this.sourceId;
    }
    
    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceType() {
        return this.sourceType;
    }
    
    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getSourceVersion() {
        return this.sourceVersion;
    }
    
    public void setSourceVersion(String sourceVersion) {
        this.sourceVersion = sourceVersion;
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

    public String getUpdatedAt() {
        return this.updatedAt;
    }
    
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUuid() {
        return this.uuid;
    }
    
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
