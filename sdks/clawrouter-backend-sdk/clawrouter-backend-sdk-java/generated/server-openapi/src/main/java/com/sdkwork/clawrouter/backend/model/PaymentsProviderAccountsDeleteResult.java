package com.sdkwork.clawrouter.backend.model;


public class PaymentsProviderAccountsDeleteResult {
    private String code;
    private CommercePaymentProviderAccountDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentProviderAccountDeleteResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentProviderAccountDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
