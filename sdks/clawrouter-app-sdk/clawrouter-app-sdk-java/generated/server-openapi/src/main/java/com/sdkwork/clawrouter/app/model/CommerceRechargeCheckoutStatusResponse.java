package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class CommerceRechargeCheckoutStatusResponse {
    private String amount;
    private String cashierUrl;
    private String createdAt;
    private String currencyCode;
    private String expiresAt;
    private String nextAction;
    private String orderNo;
    private String orderStatus;
    private String outTradeNo;
    private String paidAt;
    private String paymentMethod;
    private String paymentProduct;
    private String paymentStatus;
    private Integer points;
    private String providerCode;
    private String qrCodePayload;
    private String rechargeStatus;
    private Map<String, String> requestPaymentPayload;
    private String status;

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCashierUrl() {
        return this.cashierUrl;
    }

    public void setCashierUrl(String cashierUrl) {
        this.cashierUrl = cashierUrl;
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

    public String getPaymentProduct() {
        return this.paymentProduct;
    }

    public void setPaymentProduct(String paymentProduct) {
        this.paymentProduct = paymentProduct;
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

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
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

    public Map<String, String> getRequestPaymentPayload() {
        return this.requestPaymentPayload;
    }

    public void setRequestPaymentPayload(Map<String, String> requestPaymentPayload) {
        this.requestPaymentPayload = requestPaymentPayload;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
