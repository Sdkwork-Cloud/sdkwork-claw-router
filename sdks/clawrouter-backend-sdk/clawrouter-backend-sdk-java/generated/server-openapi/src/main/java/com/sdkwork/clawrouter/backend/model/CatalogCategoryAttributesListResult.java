package com.sdkwork.clawrouter.backend.model;


public class CatalogCategoryAttributesListResult {
    private String code;
    private CommerceProductCategoryAttributeListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductCategoryAttributeListResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductCategoryAttributeListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
