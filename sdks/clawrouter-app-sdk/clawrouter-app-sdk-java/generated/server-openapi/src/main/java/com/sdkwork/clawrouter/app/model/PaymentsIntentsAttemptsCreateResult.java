package com.sdkwork.clawrouter.app.model;


public class PaymentsIntentsAttemptsCreateResult {
    private String code;
    private CommercePaymentAttemptResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentAttemptResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentAttemptResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
