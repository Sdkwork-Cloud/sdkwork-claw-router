package com.sdkwork.clawrouter.backend.model;


public class CatalogSkusListResult {
    private String code;
    private CommerceProductSkuListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductSkuListResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductSkuListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
