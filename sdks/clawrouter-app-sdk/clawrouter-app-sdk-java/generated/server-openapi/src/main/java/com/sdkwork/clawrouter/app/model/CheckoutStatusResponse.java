package com.sdkwork.clawrouter.app.model;


public class CheckoutStatusResponse {
    private String amount;
    private String createdAt;
    private String expiresAt;
    private String nextAction;
    private String orderNo;
    private String orderStatus;
    private String outTradeNo;
    private String paidAt;
    private String paymentMethod;
    private String paymentStatus;
    private Integer points;
    private String qrCodePayload;
    private String rechargeStatus;
    private String status;

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

    public String getExpiresAt() {
        return this.expiresAt;
    }
    
    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getNextAction() {
        return this.nextAction;
    }
    
    public void setNextAction(String nextAction) {
        this.nextAction = nextAction;
    }

    public String getOrderNo() {
        return this.orderNo;
    }
    
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getOrderStatus() {
        return this.orderStatus;
    }
    
    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getOutTradeNo() {
        return this.outTradeNo;
    }
    
    public void setOutTradeNo(String outTradeNo) {
        this.outTradeNo = outTradeNo;
    }

    public String getPaidAt() {
        return this.paidAt;
    }
    
    public void setPaidAt(String paidAt) {
        this.paidAt = paidAt;
    }

    public String getPaymentMethod() {
        return this.paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return this.paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Integer getPoints() {
        return this.points;
    }
    
    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getQrCodePayload() {
        return this.qrCodePayload;
    }
    
    public void setQrCodePayload(String qrCodePayload) {
        this.qrCodePayload = qrCodePayload;
    }

    public String getRechargeStatus() {
        return this.rechargeStatus;
    }
    
    public void setRechargeStatus(String rechargeStatus) {
        this.rechargeStatus = rechargeStatus;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
