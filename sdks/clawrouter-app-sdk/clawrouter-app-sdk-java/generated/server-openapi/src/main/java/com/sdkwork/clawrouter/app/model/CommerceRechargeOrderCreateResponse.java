package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class CommerceRechargeOrderCreateResponse {
    private String amount;
    private String cashierUrl;
    private String currencyCode;
    private String nextAction;
    private String orderNo;
    private String paymentMethod;
    private String paymentProduct;
    private Integer points;
    private String providerCode;
    private String qrCodePayload;
    private Map<String, String> requestPaymentPayload;
    private String status;
    private Boolean success;

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

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
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

    public Boolean getSuccess() {
        return this.success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }
}
