package com.sdkwork.clawrouter.app.model;


public class IamVerificationPolicyRetrieveResult {
    private String code;
    private AuthVerificationPolicy data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AuthVerificationPolicy getData() {
        return this.data;
    }

    public void setData(AuthVerificationPolicy data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
