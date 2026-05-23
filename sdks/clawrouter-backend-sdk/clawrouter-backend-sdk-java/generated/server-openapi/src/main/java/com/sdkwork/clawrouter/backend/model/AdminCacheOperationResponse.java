package com.sdkwork.clawrouter.backend.model;


public class AdminCacheOperationResponse {
    private String cacheKey;
    private Integer deletedEntries;
    private String instanceName;
    private String namespace;
    private String operation;
    private Integer refreshedEntries;
    private String status;

    public String getCacheKey() {
        return this.cacheKey;
    }

    public void setCacheKey(String cacheKey) {
        this.cacheKey = cacheKey;
    }

    public Integer getDeletedEntries() {
        return this.deletedEntries;
    }

    public void setDeletedEntries(Integer deletedEntries) {
        this.deletedEntries = deletedEntries;
    }

    public String getInstanceName() {
        return this.instanceName;
    }

    public void setInstanceName(String instanceName) {
        this.instanceName = instanceName;
    }

    public String getNamespace() {
        return this.namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getOperation() {
        return this.operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public Integer getRefreshedEntries() {
        return this.refreshedEntries;
    }

    public void setRefreshedEntries(Integer refreshedEntries) {
        this.refreshedEntries = refreshedEntries;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
