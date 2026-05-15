package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AiRateLimitBucketRecord {
    private String bucketKey;
    private String createdAt;
    private String currentCount;
    private String currentTokens;
    private String id;
    private String lastRequestAt;
    private Map<String, String> metadata;
    private String organizationId;
    private String quotaPolicyId;
    private String rebuildVersion;
    private String remainingCount;
    private String remainingTokens;
    private String sourceId;
    private String sourceType;
    private String sourceVersion;
    private String status;
    private String subjectId;
    private String subjectType;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String windowEnd;
    private String windowStart;

    public String getBucketKey() {
        return this.bucketKey;
    }
    
    public void setBucketKey(String bucketKey) {
        this.bucketKey = bucketKey;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrentCount() {
        return this.currentCount;
    }
    
    public void setCurrentCount(String currentCount) {
        this.currentCount = currentCount;
    }

    public String getCurrentTokens() {
        return this.currentTokens;
    }
    
    public void setCurrentTokens(String currentTokens) {
        this.currentTokens = currentTokens;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getLastRequestAt() {
        return this.lastRequestAt;
    }
    
    public void setLastRequestAt(String lastRequestAt) {
        this.lastRequestAt = lastRequestAt;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getQuotaPolicyId() {
        return this.quotaPolicyId;
    }
    
    public void setQuotaPolicyId(String quotaPolicyId) {
        this.quotaPolicyId = quotaPolicyId;
    }

    public String getRebuildVersion() {
        return this.rebuildVersion;
    }
    
    public void setRebuildVersion(String rebuildVersion) {
        this.rebuildVersion = rebuildVersion;
    }

    public String getRemainingCount() {
        return this.remainingCount;
    }
    
    public void setRemainingCount(String remainingCount) {
        this.remainingCount = remainingCount;
    }

    public String getRemainingTokens() {
        return this.remainingTokens;
    }
    
    public void setRemainingTokens(String remainingTokens) {
        this.remainingTokens = remainingTokens;
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

    public String getSubjectId() {
        return this.subjectId;
    }
    
    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectType() {
        return this.subjectType;
    }
    
    public void setSubjectType(String subjectType) {
        this.subjectType = subjectType;
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
