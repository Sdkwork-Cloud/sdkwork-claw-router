package com.sdkwork.clawrouter.app.model;


public class RechargesSettingsRetrieveResult {
    private String code;
    private CommerceRechargeSettingsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceRechargeSettingsResponse getData() {
        return this.data;
    }

    public void setData(CommerceRechargeSettingsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
