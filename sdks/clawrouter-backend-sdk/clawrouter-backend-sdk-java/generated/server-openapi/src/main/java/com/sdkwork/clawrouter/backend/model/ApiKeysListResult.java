package com.sdkwork.clawrouter.backend.model;


public class ApiKeysListResult {
    private String code;
    private AdminApiKeysMapResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminApiKeysMapResponse getData() {
        return this.data;
    }

    public void setData(AdminApiKeysMapResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
