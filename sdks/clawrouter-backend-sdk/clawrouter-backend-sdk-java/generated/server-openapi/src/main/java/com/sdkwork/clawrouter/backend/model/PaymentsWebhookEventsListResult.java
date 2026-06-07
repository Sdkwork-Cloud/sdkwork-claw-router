package com.sdkwork.clawrouter.backend.model;


public class PaymentsWebhookEventsListResult {
    private String code;
    private CommercePaymentWebhookEventListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentWebhookEventListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentWebhookEventListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
