package com.sdkwork.clawrouter.backend.model;


public class CommerceRefundRecord {
    private String amount;
    private String createdAt;
    private String idempotencyKey;
    private String paymentAttemptId;
    private String refundNo;
    private String requestNo;
    private String status;
    private String tenantId;
    private String updatedAt;

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getIdempotencyKey() {
        return this.idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getPaymentAttemptId() {
        return this.paymentAttemptId;
    }

    public void setPaymentAttemptId(String paymentAttemptId) {
        this.paymentAttemptId = paymentAttemptId;
    }

    public String getRefundNo() {
        return this.refundNo;
    }

    public void setRefundNo(String refundNo) {
        this.refundNo = refundNo;
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
