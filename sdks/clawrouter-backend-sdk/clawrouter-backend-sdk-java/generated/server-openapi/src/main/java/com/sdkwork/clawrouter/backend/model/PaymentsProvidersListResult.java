package com.sdkwork.clawrouter.backend.model;


public class PaymentsProvidersListResult {
    private String code;
    private CommercePaymentProviderListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentProviderListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentProviderListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
