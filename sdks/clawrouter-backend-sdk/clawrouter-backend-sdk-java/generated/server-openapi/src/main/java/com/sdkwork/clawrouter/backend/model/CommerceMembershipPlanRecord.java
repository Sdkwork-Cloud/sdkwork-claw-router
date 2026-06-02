package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommerceMembershipPlanRecord {
    private Map<String, String> benefitsJson;
    private String createdAt;
    private String id;
    private String levelCode;
    private String name;
    private String organizationId;
    private String planNo;
    private String sortOrder;
    private String status;
    private String tenantId;
    private String updatedAt;

    public Map<String, String> getBenefitsJson() {
        return this.benefitsJson;
    }

    public void setBenefitsJson(Map<String, String> benefitsJson) {
        this.benefitsJson = benefitsJson;
    }

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

    public String getLevelCode() {
        return this.levelCode;
    }

    public void setLevelCode(String levelCode) {
        this.levelCode = levelCode;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPlanNo() {
        return this.planNo;
    }

    public void setPlanNo(String planNo) {
        this.planNo = planNo;
    }

    public String getSortOrder() {
        return this.sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
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

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
