package com.sdkwork.clawrouter.app.model;


public class ModelsListResult {
    private String code;
    private AppModelCatalogResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AppModelCatalogResponse getData() {
        return this.data;
    }

    public void setData(AppModelCatalogResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
