package com.sdkwork.clawrouter.backend.model;


public class ModelRankingRefreshTriggerResponse {
    private Integer cacheMaxAgeSeconds;
    private Integer generatedCount;
    private String nextRefreshAt;
    private Integer organizationId;
    private String rankScope;
    private Integer refreshIntervalSeconds;
    private String snapshotDate;
    private String snapshotPeriod;
    private Integer sourceCount;
    private String status;
    private Integer tenantId;
    private Boolean triggered;
    private String windowEnd;
    private String windowStart;

    public Integer getCacheMaxAgeSeconds() {
        return this.cacheMaxAgeSeconds;
    }
    
    public void setCacheMaxAgeSeconds(Integer cacheMaxAgeSeconds) {
        this.cacheMaxAgeSeconds = cacheMaxAgeSeconds;
    }

    public Integer getGeneratedCount() {
        return this.generatedCount;
    }
    
    public void setGeneratedCount(Integer generatedCount) {
        this.generatedCount = generatedCount;
    }

    public String getNextRefreshAt() {
        return this.nextRefreshAt;
    }
    
    public void setNextRefreshAt(String nextRefreshAt) {
        this.nextRefreshAt = nextRefreshAt;
    }

    public Integer getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(Integer organizationId) {
        this.organizationId = organizationId;
    }

    public String getRankScope() {
        return this.rankScope;
    }
    
    public void setRankScope(String rankScope) {
        this.rankScope = rankScope;
    }

    public Integer getRefreshIntervalSeconds() {
        return this.refreshIntervalSeconds;
    }
    
    public void setRefreshIntervalSeconds(Integer refreshIntervalSeconds) {
        this.refreshIntervalSeconds = refreshIntervalSeconds;
    }

    public String getSnapshotDate() {
        return this.snapshotDate;
    }
    
    public void setSnapshotDate(String snapshotDate) {
        this.snapshotDate = snapshotDate;
    }

    public String getSnapshotPeriod() {
        return this.snapshotPeriod;
    }
    
    public void setSnapshotPeriod(String snapshotPeriod) {
        this.snapshotPeriod = snapshotPeriod;
    }

    public Integer getSourceCount() {
        return this.sourceCount;
    }
    
    public void setSourceCount(Integer sourceCount) {
        this.sourceCount = sourceCount;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public Boolean getTriggered() {
        return this.triggered;
    }
    
    public void setTriggered(Boolean triggered) {
        this.triggered = triggered;
    }

    public String getWindowEnd() {
        return this.windowEnd;
    }
    
    public void setWindowEnd(String windowEnd) {
        this.windowEnd = windowEnd;
    }

    public String getWindowStart() {
        return this.windowStart;
    }
    
    public void setWindowStart(String windowStart) {
        this.windowStart = windowStart;
    }
}
