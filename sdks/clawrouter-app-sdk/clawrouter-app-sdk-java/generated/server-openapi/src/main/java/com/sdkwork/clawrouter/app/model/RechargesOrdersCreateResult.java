package com.sdkwork.clawrouter.app.model;


public class RechargesOrdersCreateResult {
    private String code;
    private CommerceRechargeOrderCreateResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceRechargeOrderCreateResponse getData() {
        return this.data;
    }

    public void setData(CommerceRechargeOrderCreateResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
