package com.sdkwork.clawrouter.backend.model;


public class AccountsDeleteResult {
    private String code;
    private OpenPlatformAccountResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformAccountResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformAccountResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
