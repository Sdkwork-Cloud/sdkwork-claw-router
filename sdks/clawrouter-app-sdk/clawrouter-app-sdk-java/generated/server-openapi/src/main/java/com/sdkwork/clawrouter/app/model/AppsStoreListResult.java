package com.sdkwork.clawrouter.app.model;


public class AppsStoreListResult {
    private String code;
    private AppCatalogResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AppCatalogResponse getData() {
        return this.data;
    }

    public void setData(AppCatalogResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
