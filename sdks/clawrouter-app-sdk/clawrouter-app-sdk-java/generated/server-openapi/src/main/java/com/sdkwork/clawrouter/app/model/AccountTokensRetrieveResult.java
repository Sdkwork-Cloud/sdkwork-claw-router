package com.sdkwork.clawrouter.app.model;


public class AccountTokensRetrieveResult {
    private String code;
    private CommerceTokenBalanceResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceTokenBalanceResponse getData() {
        return this.data;
    }

    public void setData(CommerceTokenBalanceResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
