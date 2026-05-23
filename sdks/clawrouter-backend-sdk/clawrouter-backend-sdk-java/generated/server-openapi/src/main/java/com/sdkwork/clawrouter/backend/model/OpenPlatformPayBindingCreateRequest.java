package com.sdkwork.clawrouter.backend.model;


public class OpenPlatformPayBindingCreateRequest {
    private String mode;
    private String paymentAccountId;
    private String paymentChannelId;
    private String scene;

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getPaymentAccountId() {
        return this.paymentAccountId;
    }

    public void setPaymentAccountId(String paymentAccountId) {
        this.paymentAccountId = paymentAccountId;
    }

    public String getPaymentChannelId() {
        return this.paymentChannelId;
    }

    public void setPaymentChannelId(String paymentChannelId) {
        this.paymentChannelId = paymentChannelId;
    }

    public String getScene() {
        return this.scene;
    }

    public void setScene(String scene) {
        this.scene = scene;
    }
}
