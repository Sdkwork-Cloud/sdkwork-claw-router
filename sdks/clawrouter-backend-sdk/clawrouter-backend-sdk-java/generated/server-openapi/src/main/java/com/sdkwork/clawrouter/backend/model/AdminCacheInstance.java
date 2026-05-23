package com.sdkwork.clawrouter.backend.model;


public class AdminCacheInstance {
    private Integer cacheDeletes;
    private Integer cacheErrors;
    private Integer cacheHits;
    private Integer cacheInspections;
    private Integer cacheMisses;
    private Integer cacheRefreshes;
    private Integer cacheWrites;
    private String connectionProfileName;
    private Integer defaultTtlSeconds;
    private Integer entryCount;
    private Integer expiredEntryCount;
    private String keyPrefix;
    private Integer maxEntries;
    private String name;
    private String providerKind;
    private String purpose;
    private String status;
    private Boolean supportsDelete;
    private Boolean supportsInspect;
    private Boolean supportsRefresh;

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

    public String getConnectionProfileName() {
        return this.connectionProfileName;
    }

    public void setConnectionProfileName(String connectionProfileName) {
        this.connectionProfileName = connectionProfileName;
    }

    public Integer getDefaultTtlSeconds() {
        return this.defaultTtlSeconds;
    }

    public void setDefaultTtlSeconds(Integer defaultTtlSeconds) {
        this.defaultTtlSeconds = defaultTtlSeconds;
    }

    public Integer getEntryCount() {
        return this.entryCount;
    }

    public void setEntryCount(Integer entryCount) {
        this.entryCount = entryCount;
    }

    public Integer getExpiredEntryCount() {
        return this.expiredEntryCount;
    }

    public void setExpiredEntryCount(Integer expiredEntryCount) {
        this.expiredEntryCount = expiredEntryCount;
    }

    public String getKeyPrefix() {
        return this.keyPrefix;
    }

    public void setKeyPrefix(String keyPrefix) {
        this.keyPrefix = keyPrefix;
    }

    public Integer getMaxEntries() {
        return this.maxEntries;
    }

    public void setMaxEntries(Integer maxEntries) {
        this.maxEntries = maxEntries;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProviderKind() {
        return this.providerKind;
    }

    public void setProviderKind(String providerKind) {
        this.providerKind = providerKind;
    }

    public String getPurpose() {
        return this.purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getSupportsDelete() {
        return this.supportsDelete;
    }

    public void setSupportsDelete(Boolean supportsDelete) {
        this.supportsDelete = supportsDelete;
    }

    public Boolean getSupportsInspect() {
        return this.supportsInspect;
    }

    public void setSupportsInspect(Boolean supportsInspect) {
        this.supportsInspect = supportsInspect;
    }

    public Boolean getSupportsRefresh() {
        return this.supportsRefresh;
    }

    public void setSupportsRefresh(Boolean supportsRefresh) {
        this.supportsRefresh = supportsRefresh;
    }
}
