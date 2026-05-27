package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class PromotionExternalOperationRecord {
    private String aggregateId;
    private String aggregateType;
    private String bindingId;
    private String callbackAt;
    private String callbackId;
    private String callbackSigHash;
    private String cancelUntil;
    private String createdAt;
    private String errorCode;
    private String errorMessage;
    private String externalOperationId;
    private String externalRequestNo;
    private String externalStatus;
    private String idempotencyKey;
    private String nextRetryAt;
    private String occurredAt;
    private String operationNo;
    private String operationType;
    private String organizationId;
    private String platform;
    private String providerCode;
    private String providerRequestId;
    private String replayOpId;
    private String requestHash;
    private String responseHash;
    private Map<String, String> sanitizedRequestJson;
    private Map<String, String> sanitizedResponseJson;
    private String status;
    private String tenantId;

    public String getAggregateId() {
        return this.aggregateId;
    }

    public void setAggregateId(String aggregateId) {
        this.aggregateId = aggregateId;
    }

    public String getAggregateType() {
        return this.aggregateType;
    }

    public void setAggregateType(String aggregateType) {
        this.aggregateType = aggregateType;
    }

    public String getBindingId() {
        return this.bindingId;
    }

    public void setBindingId(String bindingId) {
        this.bindingId = bindingId;
    }

    public String getCallbackAt() {
        return this.callbackAt;
    }

    public void setCallbackAt(String callbackAt) {
        this.callbackAt = callbackAt;
    }

    public String getCallbackId() {
        return this.callbackId;
    }

    public void setCallbackId(String callbackId) {
        this.callbackId = callbackId;
    }

    public String getCallbackSigHash() {
        return this.callbackSigHash;
    }

    public void setCallbackSigHash(String callbackSigHash) {
        this.callbackSigHash = callbackSigHash;
    }

    public String getCancelUntil() {
        return this.cancelUntil;
    }

    public void setCancelUntil(String cancelUntil) {
        this.cancelUntil = cancelUntil;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getErrorCode() {
        return this.errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getExternalOperationId() {
        return this.externalOperationId;
    }

    public void setExternalOperationId(String externalOperationId) {
        this.externalOperationId = externalOperationId;
    }

    public String getExternalRequestNo() {
        return this.externalRequestNo;
    }

    public void setExternalRequestNo(String externalRequestNo) {
        this.externalRequestNo = externalRequestNo;
    }

    public String getExternalStatus() {
        return this.externalStatus;
    }

    public void setExternalStatus(String externalStatus) {
        this.externalStatus = externalStatus;
    }

    public String getIdempotencyKey() {
        return this.idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getNextRetryAt() {
        return this.nextRetryAt;
    }

    public void setNextRetryAt(String nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public String getOccurredAt() {
        return this.occurredAt;
    }

    public void setOccurredAt(String occurredAt) {
        this.occurredAt = occurredAt;
    }

    public String getOperationNo() {
        return this.operationNo;
    }

    public void setOperationNo(String operationNo) {
        this.operationNo = operationNo;
    }

    public String getOperationType() {
        return this.operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPlatform() {
        return this.platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getProviderRequestId() {
        return this.providerRequestId;
    }

    public void setProviderRequestId(String providerRequestId) {
        this.providerRequestId = providerRequestId;
    }

    public String getReplayOpId() {
        return this.replayOpId;
    }

    public void setReplayOpId(String replayOpId) {
        this.replayOpId = replayOpId;
    }

    public String getRequestHash() {
        return this.requestHash;
    }

    public void setRequestHash(String requestHash) {
        this.requestHash = requestHash;
    }

    public String getResponseHash() {
        return this.responseHash;
    }

    public void setResponseHash(String responseHash) {
        this.responseHash = responseHash;
    }

    public Map<String, String> getSanitizedRequestJson() {
        return this.sanitizedRequestJson;
    }

    public void setSanitizedRequestJson(Map<String, String> sanitizedRequestJson) {
        this.sanitizedRequestJson = sanitizedRequestJson;
    }

    public Map<String, String> getSanitizedResponseJson() {
        return this.sanitizedResponseJson;
    }

    public void setSanitizedResponseJson(Map<String, String> sanitizedResponseJson) {
        this.sanitizedResponseJson = sanitizedResponseJson;
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
}
