package com.sdkwork.clawrouter.backend.model;


public class AppsCategoriesUpdateResult {
    private String code;
    private AdminAppCategoryMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppCategoryMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminAppCategoryMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
