package com.sdkwork.clawrouter.backend.model;


public class AppsDeleteResult {
    private String code;
    private AdminAppDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppDeleteResponse getData() {
        return this.data;
    }

    public void setData(AdminAppDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
