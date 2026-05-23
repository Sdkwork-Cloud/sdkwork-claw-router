package com.sdkwork.clawrouter.app.model;


public class AccountPointsExchangeRateRetrieveResult {
    private String code;
    private CommercePointsExchangeRateResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePointsExchangeRateResponse getData() {
        return this.data;
    }

    public void setData(CommercePointsExchangeRateResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
