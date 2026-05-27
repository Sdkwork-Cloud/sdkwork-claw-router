package com.sdkwork.clawrouter.app.model;


public class QrAuthSessionsScansCreateResult {
    private String code;
    private OpenPlatformQrAuthScanResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformQrAuthScanResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformQrAuthScanResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
