package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class IamVerificationScenePolicyRecord {
    private Map<String, String> allowedChannels;
    private String codeCharset;
    private Integer codeLength;
    private String createdAt;
    private String dataScope;
    private String defaultChannel;
    private String deletedAt;
    private String deletedBy;
    private String id;
    private Integer maxSendPerHour;
    private Integer maxVerifyAttempts;
    private Map<String, String> metadata;
    private String organizationId;
    private Integer resendIntervalSeconds;
    private Map<String, String> riskPolicy;
    private Map<String, String> rolloutPolicy;
    private String sceneCode;
    private String sceneName;
    private String status;
    private Boolean targetBindingRequired;
    private String templateCode;
    private String tenantId;
    private Integer ttlSeconds;
    private String updatedAt;
    private String uuid;
    private String version;

    public Map<String, String> getAllowedChannels() {
        return this.allowedChannels;
    }

    public void setAllowedChannels(Map<String, String> allowedChannels) {
        this.allowedChannels = allowedChannels;
    }

    public String getCodeCharset() {
        return this.codeCharset;
    }

    public void setCodeCharset(String codeCharset) {
        this.codeCharset = codeCharset;
    }

    public Integer getCodeLength() {
        return this.codeLength;
    }

    public void setCodeLength(Integer codeLength) {
        this.codeLength = codeLength;
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

    public String getDefaultChannel() {
        return this.defaultChannel;
    }

    public void setDefaultChannel(String defaultChannel) {
        this.defaultChannel = defaultChannel;
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

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getMaxSendPerHour() {
        return this.maxSendPerHour;
    }

    public void setMaxSendPerHour(Integer maxSendPerHour) {
        this.maxSendPerHour = maxSendPerHour;
    }

    public Integer getMaxVerifyAttempts() {
        return this.maxVerifyAttempts;
    }

    public void setMaxVerifyAttempts(Integer maxVerifyAttempts) {
        this.maxVerifyAttempts = maxVerifyAttempts;
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

    public Integer getResendIntervalSeconds() {
        return this.resendIntervalSeconds;
    }

    public void setResendIntervalSeconds(Integer resendIntervalSeconds) {
        this.resendIntervalSeconds = resendIntervalSeconds;
    }

    public Map<String, String> getRiskPolicy() {
        return this.riskPolicy;
    }

    public void setRiskPolicy(Map<String, String> riskPolicy) {
        this.riskPolicy = riskPolicy;
    }

    public Map<String, String> getRolloutPolicy() {
        return this.rolloutPolicy;
    }

    public void setRolloutPolicy(Map<String, String> rolloutPolicy) {
        this.rolloutPolicy = rolloutPolicy;
    }

    public String getSceneCode() {
        return this.sceneCode;
    }

    public void setSceneCode(String sceneCode) {
        this.sceneCode = sceneCode;
    }

    public String getSceneName() {
        return this.sceneName;
    }

    public void setSceneName(String sceneName) {
        this.sceneName = sceneName;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getTargetBindingRequired() {
        return this.targetBindingRequired;
    }

    public void setTargetBindingRequired(Boolean targetBindingRequired) {
        this.targetBindingRequired = targetBindingRequired;
    }

    public String getTemplateCode() {
        return this.templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Integer getTtlSeconds() {
        return this.ttlSeconds;
    }

    public void setTtlSeconds(Integer ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
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

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
