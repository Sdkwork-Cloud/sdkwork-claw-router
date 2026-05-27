package com.sdkwork.clawrouter.app.model;


public class PaymentsMethodsListResult {
    private String code;
    private CommercePaymentMethodListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentMethodListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentMethodListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
