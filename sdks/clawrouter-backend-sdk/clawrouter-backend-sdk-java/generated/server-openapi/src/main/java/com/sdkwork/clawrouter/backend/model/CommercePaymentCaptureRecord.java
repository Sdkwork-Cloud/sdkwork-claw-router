package com.sdkwork.clawrouter.backend.model;


public class CommercePaymentCaptureRecord {
    private String amount;
    private String captureNo;
    private String createdAt;
    private String currencyCode;
    private String failedAt;
    private String failureCode;
    private String failureMessage;
    private String finalCapture;
    private String id;
    private String idempotencyKey;
    private String nativeCaptureId;
    private String organizationId;
    private String paymentAttemptId;
    private String providerAccountId;
    private String providerCode;
    private String requestNo;
    private String status;
    private String submittedAt;
    private String succeededAt;
    private String tenantId;
    private String updatedAt;

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCaptureNo() {
        return this.captureNo;
    }

    public void setCaptureNo(String captureNo) {
        this.captureNo = captureNo;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getFailedAt() {
        return this.failedAt;
    }

    public void setFailedAt(String failedAt) {
        this.failedAt = failedAt;
    }

    public String getFailureCode() {
        return this.failureCode;
    }

    public void setFailureCode(String failureCode) {
        this.failureCode = failureCode;
    }

    public String getFailureMessage() {
        return this.failureMessage;
    }

    public void setFailureMessage(String failureMessage) {
        this.failureMessage = failureMessage;
    }

    public String getFinalCapture() {
        return this.finalCapture;
    }

    public void setFinalCapture(String finalCapture) {
        this.finalCapture = finalCapture;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdempotencyKey() {
        return this.idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getNativeCaptureId() {
        return this.nativeCaptureId;
    }

    public void setNativeCaptureId(String nativeCaptureId) {
        this.nativeCaptureId = nativeCaptureId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPaymentAttemptId() {
        return this.paymentAttemptId;
    }

    public void setPaymentAttemptId(String paymentAttemptId) {
        this.paymentAttemptId = paymentAttemptId;
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

    public String getRequestNo() {
        return this.requestNo;
    }

    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubmittedAt() {
        return this.submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getSucceededAt() {
        return this.succeededAt;
    }

    public void setSucceededAt(String succeededAt) {
        this.succeededAt = succeededAt;
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
