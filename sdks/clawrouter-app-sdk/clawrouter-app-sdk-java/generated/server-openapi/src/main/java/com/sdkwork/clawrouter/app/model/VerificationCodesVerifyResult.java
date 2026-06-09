package com.sdkwork.clawrouter.app.model;


public class VerificationCodesVerifyResult {
    private String code;
    private IamVerificationCodeVerifyResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamVerificationCodeVerifyResponse getData() {
        return this.data;
    }

    public void setData(IamVerificationCodeVerifyResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
