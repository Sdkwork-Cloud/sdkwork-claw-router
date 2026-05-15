package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class OpsGatewayHeartbeatRecord {
    private String activeConnections;
    private String cpuPercent;
    private String createdAt;
    private String diskPercent;
    private String heartbeatAt;
    private String id;
    private String instanceId;
    private Boolean legalHold;
    private String memoryPercent;
    private Map<String, String> metadata;
    private String networkInBytes;
    private String networkOutBytes;
    private String openFileCount;
    private String organizationId;
    private Map<String, String> payload;
    private String payloadHash;
    private String requestId;
    private String retentionUntil;
    private String status;
    private String tenantId;
    private String threadCount;
    private String traceId;
    private String uptimeSeconds;
    private String userId;
    private String uuid;

    public String getActiveConnections() {
        return this.activeConnections;
    }
    
    public void setActiveConnections(String activeConnections) {
        this.activeConnections = activeConnections;
    }

    public String getCpuPercent() {
        return this.cpuPercent;
    }
    
    public void setCpuPercent(String cpuPercent) {
        this.cpuPercent = cpuPercent;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDiskPercent() {
        return this.diskPercent;
    }
    
    public void setDiskPercent(String diskPercent) {
        this.diskPercent = diskPercent;
    }

    public String getHeartbeatAt() {
        return this.heartbeatAt;
    }
    
    public void setHeartbeatAt(String heartbeatAt) {
        this.heartbeatAt = heartbeatAt;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getInstanceId() {
        return this.instanceId;
    }
    
    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public Boolean getLegalHold() {
        return this.legalHold;
    }
    
    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public String getMemoryPercent() {
        return this.memoryPercent;
    }
    
    public void setMemoryPercent(String memoryPercent) {
        this.memoryPercent = memoryPercent;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getNetworkInBytes() {
        return this.networkInBytes;
    }
    
    public void setNetworkInBytes(String networkInBytes) {
        this.networkInBytes = networkInBytes;
    }

    public String getNetworkOutBytes() {
        return this.networkOutBytes;
    }
    
    public void setNetworkOutBytes(String networkOutBytes) {
        this.networkOutBytes = networkOutBytes;
    }

    public String getOpenFileCount() {
        return this.openFileCount;
    }
    
    public void setOpenFileCount(String openFileCount) {
        this.openFileCount = openFileCount;
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

    public String getPayloadHash() {
        return this.payloadHash;
    }
    
    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getRequestId() {
        return this.requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRetentionUntil() {
        return this.retentionUntil;
    }
    
    public void setRetentionUntil(String retentionUntil) {
        this.retentionUntil = retentionUntil;
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

    public String getThreadCount() {
        return this.threadCount;
    }
    
    public void setThreadCount(String threadCount) {
        this.threadCount = threadCount;
    }

    public String getTraceId() {
        return this.traceId;
    }
    
    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getUptimeSeconds() {
        return this.uptimeSeconds;
    }
    
    public void setUptimeSeconds(String uptimeSeconds) {
        this.uptimeSeconds = uptimeSeconds;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUuid() {
        return this.uuid;
    }
    
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
