package com.sdkwork.clawrouter.backend.model;


public class StorageQuotaPolicy {
    private String createdAt;
    private String enforcement;
    private String id;
    private Integer limit;
    private Integer quotaLimitBytes;
    private String scopeId;
    private String scopeType;
    private Integer singleFileLimitBytes;
    private String status;
    private String updatedAt;
    private Integer used;
    private Integer usedBytes;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getEnforcement() {
        return this.enforcement;
    }

    public void setEnforcement(String enforcement) {
        this.enforcement = enforcement;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLimit() {
        return this.limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getQuotaLimitBytes() {
        return this.quotaLimitBytes;
    }

    public void setQuotaLimitBytes(Integer quotaLimitBytes) {
        this.quotaLimitBytes = quotaLimitBytes;
    }

    public String getScopeId() {
        return this.scopeId;
    }

    public void setScopeId(String scopeId) {
        this.scopeId = scopeId;
    }

    public String getScopeType() {
        return this.scopeType;
    }

    public void setScopeType(String scopeType) {
        this.scopeType = scopeType;
    }

    public Integer getSingleFileLimitBytes() {
        return this.singleFileLimitBytes;
    }

    public void setSingleFileLimitBytes(Integer singleFileLimitBytes) {
        this.singleFileLimitBytes = singleFileLimitBytes;
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

    public Integer getUsed() {
        return this.used;
    }

    public void setUsed(Integer used) {
        this.used = used;
    }

    public Integer getUsedBytes() {
        return this.usedBytes;
    }

    public void setUsedBytes(Integer usedBytes) {
        this.usedBytes = usedBytes;
    }
}
