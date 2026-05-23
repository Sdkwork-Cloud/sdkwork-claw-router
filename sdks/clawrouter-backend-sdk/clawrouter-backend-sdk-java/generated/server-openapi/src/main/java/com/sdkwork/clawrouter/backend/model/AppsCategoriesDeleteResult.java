package com.sdkwork.clawrouter.backend.model;


public class AppsCategoriesDeleteResult {
    private String code;
    private AdminAppCategoryDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppCategoryDeleteResponse getData() {
        return this.data;
    }

    public void setData(AdminAppCategoryDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
