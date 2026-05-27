package com.sdkwork.clawrouter.app.model;


public class BillingHistoryListResult {
    private String code;
    private BillingHistoryCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BillingHistoryCollectionResponse getData() {
        return this.data;
    }

    public void setData(BillingHistoryCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
