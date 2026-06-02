package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class PromotionOfferAudienceRuleRecord {
    private String createdAt;
    private String id;
    private String offerVersionId;
    private String organizationId;
    private Integer priority;
    private String ruleOperator;
    private String ruleType;
    private String ruleValue;
    private Map<String, String> ruleValueJson;
    private String tenantId;
    private String updatedAt;

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOfferVersionId() {
        return this.offerVersionId;
    }

    public void setOfferVersionId(String offerVersionId) {
        this.offerVersionId = offerVersionId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public String getRuleOperator() {
        return this.ruleOperator;
    }

    public void setRuleOperator(String ruleOperator) {
        this.ruleOperator = ruleOperator;
    }

    public String getRuleType() {
        return this.ruleType;
    }

    public void setRuleType(String ruleType) {
        this.ruleType = ruleType;
    }

    public String getRuleValue() {
        return this.ruleValue;
    }

    public void setRuleValue(String ruleValue) {
        this.ruleValue = ruleValue;
    }

    public Map<String, String> getRuleValueJson() {
        return this.ruleValueJson;
    }

    public void setRuleValueJson(Map<String, String> ruleValueJson) {
        this.ruleValueJson = ruleValueJson;
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
}
