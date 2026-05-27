package com.sdkwork.clawrouter.app.model;


public class CatalogSkusRetrieveResult {
    private String code;
    private CommerceProductSkuResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductSkuResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductSkuResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
