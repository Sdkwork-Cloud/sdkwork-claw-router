package com.sdkwork.clawrouter.app.model;


public class QrAuthSessionsCreateResult {
    private String code;
    private OpenPlatformQrAuthSessionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformQrAuthSessionResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformQrAuthSessionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
