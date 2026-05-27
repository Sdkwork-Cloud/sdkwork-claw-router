package com.sdkwork.clawrouter.app.model;


public class CatalogProductsRetrieveResult {
    private String code;
    private CommerceProductSpuDetailResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductSpuDetailResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductSpuDetailResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
