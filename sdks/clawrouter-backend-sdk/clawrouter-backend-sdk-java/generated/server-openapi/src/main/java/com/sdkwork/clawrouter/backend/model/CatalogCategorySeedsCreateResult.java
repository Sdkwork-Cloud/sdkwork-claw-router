package com.sdkwork.clawrouter.backend.model;


public class CatalogCategorySeedsCreateResult {
    private String code;
    private CommerceCategorySeedInitializeResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceCategorySeedInitializeResponse getData() {
        return this.data;
    }

    public void setData(CommerceCategorySeedInitializeResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
