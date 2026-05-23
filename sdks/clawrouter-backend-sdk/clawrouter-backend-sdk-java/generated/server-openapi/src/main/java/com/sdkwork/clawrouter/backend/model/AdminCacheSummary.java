package com.sdkwork.clawrouter.backend.model;


public class AdminCacheSummary {
    private Integer cacheDeletes;
    private Integer cacheErrors;
    private Integer cacheHits;
    private Integer cacheInspections;
    private Integer cacheMisses;
    private Integer cacheRefreshes;
    private Integer cacheWrites;
    private Integer expiredEntries;
    private String runtimeTarget;
    private Integer totalEntries;
    private Integer totalInstances;
    private Integer totalNamespaces;

    public Integer getCacheDeletes() {
        return this.cacheDeletes;
    }

    public void setCacheDeletes(Integer cacheDeletes) {
        this.cacheDeletes = cacheDeletes;
    }

    public Integer getCacheErrors() {
        return this.cacheErrors;
    }

    public void setCacheErrors(Integer cacheErrors) {
        this.cacheErrors = cacheErrors;
    }

    public Integer getCacheHits() {
        return this.cacheHits;
    }

    public void setCacheHits(Integer cacheHits) {
        this.cacheHits = cacheHits;
    }

    public Integer getCacheInspections() {
        return this.cacheInspections;
    }

    public void setCacheInspections(Integer cacheInspections) {
        this.cacheInspections = cacheInspections;
    }

    public Integer getCacheMisses() {
        return this.cacheMisses;
    }

    public void setCacheMisses(Integer cacheMisses) {
        this.cacheMisses = cacheMisses;
    }

    public Integer getCacheRefreshes() {
        return this.cacheRefreshes;
    }

    public void setCacheRefreshes(Integer cacheRefreshes) {
        this.cacheRefreshes = cacheRefreshes;
    }

    public Integer getCacheWrites() {
        return this.cacheWrites;
    }

    public void setCacheWrites(Integer cacheWrites) {
        this.cacheWrites = cacheWrites;
    }

    public Integer getExpiredEntries() {
        return this.expiredEntries;
    }

    public void setExpiredEntries(Integer expiredEntries) {
        this.expiredEntries = expiredEntries;
    }

    public String getRuntimeTarget() {
        return this.runtimeTarget;
    }

    public void setRuntimeTarget(String runtimeTarget) {
        this.runtimeTarget = runtimeTarget;
    }

    public Integer getTotalEntries() {
        return this.totalEntries;
    }

    public void setTotalEntries(Integer totalEntries) {
        this.totalEntries = totalEntries;
    }

    public Integer getTotalInstances() {
        return this.totalInstances;
    }

    public void setTotalInstances(Integer totalInstances) {
        this.totalInstances = totalInstances;
    }

    public Integer getTotalNamespaces() {
        return this.totalNamespaces;
    }

    public void setTotalNamespaces(Integer totalNamespaces) {
        this.totalNamespaces = totalNamespaces;
    }
}
