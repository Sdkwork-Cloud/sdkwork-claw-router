package com.sdkwork.clawrouter.app.model;


public class AccountPointsRetrieveResult {
    private String code;
    private CommercePointsBalanceResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePointsBalanceResponse getData() {
        return this.data;
    }

    public void setData(CommercePointsBalanceResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
