package com.sdkwork.clawrouter.backend.model;


public class AccountsPayBindingsListResult {
    private String code;
    private OpenPlatformPayBindingListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformPayBindingListResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformPayBindingListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
