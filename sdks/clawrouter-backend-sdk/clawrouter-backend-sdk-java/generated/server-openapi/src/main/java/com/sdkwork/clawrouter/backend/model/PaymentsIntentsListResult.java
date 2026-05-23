package com.sdkwork.clawrouter.backend.model;


public class PaymentsIntentsListResult {
    private String code;
    private CommercePaymentIntentListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentIntentListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentIntentListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
