package com.sdkwork.clawrouter.app.model;


public class RuntimeSettingsRetrieveResult {
    private String code;
    private AuthRuntimeSettingsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AuthRuntimeSettingsResponse getData() {
        return this.data;
    }

    public void setData(AuthRuntimeSettingsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
