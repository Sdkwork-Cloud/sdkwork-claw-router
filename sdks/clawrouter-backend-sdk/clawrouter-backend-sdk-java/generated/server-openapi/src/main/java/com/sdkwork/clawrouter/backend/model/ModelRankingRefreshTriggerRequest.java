package com.sdkwork.clawrouter.backend.model;


public class ModelRankingRefreshTriggerRequest {
    private Integer cacheMaxAgeSeconds;
    private Integer limit;
    private Integer lookbackDays;
    private String rankScope;
    private Integer refreshIntervalSeconds;
    private String snapshotPeriod;

    public Integer getCacheMaxAgeSeconds() {
        return this.cacheMaxAgeSeconds;
    }
    
    public void setCacheMaxAgeSeconds(Integer cacheMaxAgeSeconds) {
        this.cacheMaxAgeSeconds = cacheMaxAgeSeconds;
    }

    public Integer getLimit() {
        return this.limit;
    }
    
    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getLookbackDays() {
        return this.lookbackDays;
    }
    
    public void setLookbackDays(Integer lookbackDays) {
        this.lookbackDays = lookbackDays;
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

    public String getSnapshotPeriod() {
        return this.snapshotPeriod;
    }
    
    public void setSnapshotPeriod(String snapshotPeriod) {
        this.snapshotPeriod = snapshotPeriod;
    }
}
