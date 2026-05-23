package com.sdkwork.clawrouter.backend.model;


public class AppsCategoriesListResult {
    private String code;
    private AdminAppCategoryListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppCategoryListResponse getData() {
        return this.data;
    }

    public void setData(AdminAppCategoryListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
