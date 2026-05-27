package com.sdkwork.clawrouter.backend.model;


public class CreateStorageQuotaPolicyRequest {
    private String enforcement;
    private String quotaLimit;
    private Integer quotaLimitBytes;
    private String scopeId;
    private String scopeType;
    private Integer singleFileLimitBytes;

    public String getEnforcement() {
        return this.enforcement;
    }

    public void setEnforcement(String enforcement) {
        this.enforcement = enforcement;
    }

    public String getQuotaLimit() {
        return this.quotaLimit;
    }

    public void setQuotaLimit(String quotaLimit) {
        this.quotaLimit = quotaLimit;
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
}
