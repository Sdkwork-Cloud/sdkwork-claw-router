package com.sdkwork.clawrouter.backend.model;


public class PaymentsProviderAccountsUpdateResult {
    private String code;
    private CommercePaymentProviderAccountMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentProviderAccountMutationResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentProviderAccountMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
