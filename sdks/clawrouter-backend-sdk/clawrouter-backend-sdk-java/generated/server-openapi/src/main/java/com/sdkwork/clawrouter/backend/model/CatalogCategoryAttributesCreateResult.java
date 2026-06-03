package com.sdkwork.clawrouter.backend.model;


public class CatalogCategoryAttributesCreateResult {
    private String code;
    private CommerceProductCategoryAttributeMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductCategoryAttributeMutationResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductCategoryAttributeMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
