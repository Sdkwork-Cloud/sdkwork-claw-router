package com.sdkwork.clawrouter.app.model;


public class PaymentsIntentsRetrieveResult {
    private String code;
    private CommercePaymentIntentResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentIntentResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentIntentResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
