package com.sdkwork.clawrouter.backend.model;


public class CatalogCategoriesListResult {
    private String code;
    private CommerceProductCategoryListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductCategoryListResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductCategoryListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
