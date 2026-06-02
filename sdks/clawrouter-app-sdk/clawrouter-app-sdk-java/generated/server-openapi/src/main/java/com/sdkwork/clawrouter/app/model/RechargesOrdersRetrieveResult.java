package com.sdkwork.clawrouter.app.model;


public class RechargesOrdersRetrieveResult {
    private String code;
    private CommerceRechargeCheckoutStatusResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceRechargeCheckoutStatusResponse getData() {
        return this.data;
    }

    public void setData(CommerceRechargeCheckoutStatusResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
