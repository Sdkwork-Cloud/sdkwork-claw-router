package com.sdkwork.clawrouter.backend.model;


public class AppsListResult {
    private String code;
    private AdminAppListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppListResponse getData() {
        return this.data;
    }

    public void setData(AdminAppListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
