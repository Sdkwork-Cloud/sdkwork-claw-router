package com.sdkwork.clawrouter.app.model;


public class CommercePaymentAttemptItem {
    private String amount;
    private String attemptNo;
    private String createdAt;
    private String currencyCode;
    private String externalTradeNo;
    private String id;
    private String intentId;
    private String methodCode;
    private String paidAt;
    private String providerCode;
    private String status;
    private String updatedAt;

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getAttemptNo() {
        return this.attemptNo;
    }

    public void setAttemptNo(String attemptNo) {
        this.attemptNo = attemptNo;
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

    public String getExternalTradeNo() {
        return this.externalTradeNo;
    }

    public void setExternalTradeNo(String externalTradeNo) {
        this.externalTradeNo = externalTradeNo;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIntentId() {
        return this.intentId;
    }

    public void setIntentId(String intentId) {
        this.intentId = intentId;
    }

    public String getMethodCode() {
        return this.methodCode;
    }

    public void setMethodCode(String methodCode) {
        this.methodCode = methodCode;
    }

    public String getPaidAt() {
        return this.paidAt;
    }

    public void setPaidAt(String paidAt) {
        this.paidAt = paidAt;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
