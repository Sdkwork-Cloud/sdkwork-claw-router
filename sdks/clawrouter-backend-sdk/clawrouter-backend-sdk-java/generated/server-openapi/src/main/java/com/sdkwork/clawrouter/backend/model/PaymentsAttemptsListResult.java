package com.sdkwork.clawrouter.backend.model;


public class PaymentsAttemptsListResult {
    private String code;
    private CommercePaymentAttemptListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentAttemptListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentAttemptListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
