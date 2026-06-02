package com.sdkwork.clawrouter.app.model;


public class CommerceOperationResponse {
    private String paymentId;
    private MediaResource qrCode;
    private String qrCodePayload;
    private String requestNo;
    private String status;
    private Boolean success;

    public String getPaymentId() {
        return this.paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public MediaResource getQrCode() {
        return this.qrCode;
    }

    public void setQrCode(MediaResource qrCode) {
        this.qrCode = qrCode;
    }

    public String getQrCodePayload() {
        return this.qrCodePayload;
    }

    public void setQrCodePayload(String qrCodePayload) {
        this.qrCodePayload = qrCodePayload;
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

    public Boolean getSuccess() {
        return this.success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }
}
