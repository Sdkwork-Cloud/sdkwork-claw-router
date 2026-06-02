package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class MessagingRouteRuleTargetRecord {
    private Map<String, String> circuitBreakerPolicy;
    private String createdAt;
    private String dataScope;
    private String deletedAt;
    private String deletedBy;
    private String id;
    private Map<String, String> metadata;
    private String organizationId;
    private String providerAccountId;
    private String providerCode;
    private String routeRuleId;
    private String senderIdentityId;
    private String status;
    private Integer targetOrder;
    private String templateBindingId;
    private String tenantId;
    private String updatedAt;
    private String uuid;
    private String version;
    private Integer weight;

    public Map<String, String> getCircuitBreakerPolicy() {
        return this.circuitBreakerPolicy;
    }

    public void setCircuitBreakerPolicy(Map<String, String> circuitBreakerPolicy) {
        this.circuitBreakerPolicy = circuitBreakerPolicy;
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

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getProviderAccountId() {
        return this.providerAccountId;
    }

    public void setProviderAccountId(String providerAccountId) {
        this.providerAccountId = providerAccountId;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getRouteRuleId() {
        return this.routeRuleId;
    }

    public void setRouteRuleId(String routeRuleId) {
        this.routeRuleId = routeRuleId;
    }

    public String getSenderIdentityId() {
        return this.senderIdentityId;
    }

    public void setSenderIdentityId(String senderIdentityId) {
        this.senderIdentityId = senderIdentityId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTargetOrder() {
        return this.targetOrder;
    }

    public void setTargetOrder(Integer targetOrder) {
        this.targetOrder = targetOrder;
    }

    public String getTemplateBindingId() {
        return this.templateBindingId;
    }

    public void setTemplateBindingId(String templateBindingId) {
        this.templateBindingId = templateBindingId;
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

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Integer getWeight() {
        return this.weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
