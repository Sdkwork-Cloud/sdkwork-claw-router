package com.sdkwork.clawrouter.backend.model;


public class CatalogProductsListResult {
    private String code;
    private CommerceProductSpuListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductSpuListResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductSpuListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
