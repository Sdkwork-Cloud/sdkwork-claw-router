package com.sdkwork.clawrouter.app.model;


public class IamVerificationCodeResponse {
    private String codeId;
    private String deliveryRequestId;
    private String expiresAt;

    public String getCodeId() {
        return this.codeId;
    }

    public void setCodeId(String codeId) {
        this.codeId = codeId;
    }

    public String getDeliveryRequestId() {
        return this.deliveryRequestId;
    }

    public void setDeliveryRequestId(String deliveryRequestId) {
        this.deliveryRequestId = deliveryRequestId;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }
}
