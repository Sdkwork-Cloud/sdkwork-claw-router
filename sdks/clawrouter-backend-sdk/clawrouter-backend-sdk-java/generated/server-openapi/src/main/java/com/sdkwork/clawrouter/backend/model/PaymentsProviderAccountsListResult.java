package com.sdkwork.clawrouter.backend.model;


public class PaymentsProviderAccountsListResult {
    private String code;
    private CommercePaymentProviderAccountListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentProviderAccountListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentProviderAccountListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
