package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class MessagingRateLimitBucketRecord {
    private String channel;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String deviceHash;
    private String id;
    private String ipHash;
    private String lastEventAt;
    private Map<String, String> metadata;
    private String organizationId;
    private Integer rejectCount;
    private String sceneCode;
    private Integer sendCount;
    private String status;
    private String targetHash;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private Integer verifyCount;
    private String version;
    private Integer windowSeconds;
    private String windowStart;

    public String getChannel() {
        return this.channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDataScope() {
        return this.dataScope;
    }

    public void setDataScope(String dataScope) {
        this.dataScope = dataScope;
    }

    public String getDeletedAt() {
        return this.deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getDeletedBy() {
        return this.deletedBy;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public String getDeviceHash() {
        return this.deviceHash;
    }

    public void setDeviceHash(String deviceHash) {
        this.deviceHash = deviceHash;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIpHash() {
        return this.ipHash;
    }

    public void setIpHash(String ipHash) {
        this.ipHash = ipHash;
    }

    public String getLastEventAt() {
        return this.lastEventAt;
    }

    public void setLastEventAt(String lastEventAt) {
        this.lastEventAt = lastEventAt;
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

    public Integer getRejectCount() {
        return this.rejectCount;
    }

    public void setRejectCount(Integer rejectCount) {
        this.rejectCount = rejectCount;
    }

    public String getSceneCode() {
        return this.sceneCode;
    }

    public void setSceneCode(String sceneCode) {
        this.sceneCode = sceneCode;
    }

    public Integer getSendCount() {
        return this.sendCount;
    }

    public void setSendCount(Integer sendCount) {
        this.sendCount = sendCount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetHash() {
        return this.targetHash;
    }

    public void setTargetHash(String targetHash) {
        this.targetHash = targetHash;
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

    public Integer getVerifyCount() {
        return this.verifyCount;
    }

    public void setVerifyCount(Integer verifyCount) {
        this.verifyCount = verifyCount;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Integer getWindowSeconds() {
        return this.windowSeconds;
    }

    public void setWindowSeconds(Integer windowSeconds) {
        this.windowSeconds = windowSeconds;
    }

    public String getWindowStart() {
        return this.windowStart;
    }

    public void setWindowStart(String windowStart) {
        this.windowStart = windowStart;
    }
}
