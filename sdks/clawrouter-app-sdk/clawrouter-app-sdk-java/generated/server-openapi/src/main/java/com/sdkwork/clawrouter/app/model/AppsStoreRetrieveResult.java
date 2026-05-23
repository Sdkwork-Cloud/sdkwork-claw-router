package com.sdkwork.clawrouter.app.model;


public class AppsStoreRetrieveResult {
    private String code;
    private AppDetailResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AppDetailResponse getData() {
        return this.data;
    }

    public void setData(AppDetailResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
