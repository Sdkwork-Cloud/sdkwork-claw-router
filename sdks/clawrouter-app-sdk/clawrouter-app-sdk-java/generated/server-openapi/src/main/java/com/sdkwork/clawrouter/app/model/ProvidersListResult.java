package com.sdkwork.clawrouter.app.model;


public class ProvidersListResult {
    private String code;
    private ProvidersResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public ProvidersResponse getData() {
        return this.data;
    }

    public void setData(ProvidersResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
