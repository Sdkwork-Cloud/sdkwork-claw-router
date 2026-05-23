package com.sdkwork.clawrouter.backend.model;


public class AccountsPayBindingsDeleteResult {
    private String code;
    private OpenPlatformPayBindingResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformPayBindingResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformPayBindingResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
