package com.sdkwork.clawrouter.backend.model;


public class AccountsListResult {
    private String code;
    private OpenPlatformAccountListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformAccountListResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformAccountListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
