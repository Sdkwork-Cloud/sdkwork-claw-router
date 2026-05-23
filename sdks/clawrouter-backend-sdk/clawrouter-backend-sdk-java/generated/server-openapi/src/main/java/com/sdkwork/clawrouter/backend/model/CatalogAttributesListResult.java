package com.sdkwork.clawrouter.backend.model;


public class CatalogAttributesListResult {
    private String code;
    private CommerceProductAttributeListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductAttributeListResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductAttributeListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
