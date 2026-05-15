package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class OpsAuditLogRecord {
    private String action;
    private String afterHash;
    private String approvalId;
    private String beforeHash;
    private Map<String, String> changeSummary;
    private String clientIpHash;
    private String createdAt;
    private String id;
    private Boolean legalHold;
    private Map<String, String> metadata;
    private String operatorId;
    private String operatorNameSnapshot;
    private String operatorType;
    private String organizationId;
    private String requestId;
    private String retentionUntil;
    private String riskLevel;
    private String targetId;
    private String targetType;
    private String targetUuid;
    private String tenantId;
    private String traceId;
    private String userAgentHash;
    private String uuid;

    public String getAction() {
        return this.action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }

    public String getAfterHash() {
        return this.afterHash;
    }
    
    public void setAfterHash(String afterHash) {
        this.afterHash = afterHash;
    }

    public String getApprovalId() {
        return this.approvalId;
    }
    
    public void setApprovalId(String approvalId) {
        this.approvalId = approvalId;
    }

    public String getBeforeHash() {
        return this.beforeHash;
    }
    
    public void setBeforeHash(String beforeHash) {
        this.beforeHash = beforeHash;
    }

    public Map<String, String> getChangeSummary() {
        return this.changeSummary;
    }
    
    public void setChangeSummary(Map<String, String> changeSummary) {
        this.changeSummary = changeSummary;
    }

    public String getClientIpHash() {
        return this.clientIpHash;
    }
    
    public void setClientIpHash(String clientIpHash) {
        this.clientIpHash = clientIpHash;
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

    public Boolean getLegalHold() {
        return this.legalHold;
    }
    
    public void setLegalHold(Boolean legalHold) {
        this.legalHold = legalHold;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getOperatorId() {
        return this.operatorId;
    }
    
    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    public String getOperatorNameSnapshot() {
        return this.operatorNameSnapshot;
    }
    
    public void setOperatorNameSnapshot(String operatorNameSnapshot) {
        this.operatorNameSnapshot = operatorNameSnapshot;
    }

    public String getOperatorType() {
        return this.operatorType;
    }
    
    public void setOperatorType(String operatorType) {
        this.operatorType = operatorType;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
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

    public String getRiskLevel() {
        return this.riskLevel;
    }
    
    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getTargetId() {
        return this.targetId;
    }
    
    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getTargetType() {
        return this.targetType;
    }
    
    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTargetUuid() {
        return this.targetUuid;
    }
    
    public void setTargetUuid(String targetUuid) {
        this.targetUuid = targetUuid;
    }

    public String getTenantId() {
        return this.tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTraceId() {
        return this.traceId;
    }
    
    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public String getUserAgentHash() {
        return this.userAgentHash;
    }
    
    public void setUserAgentHash(String userAgentHash) {
        this.userAgentHash = userAgentHash;
    }

    public String getUuid() {
        return this.uuid;
    }
    
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
