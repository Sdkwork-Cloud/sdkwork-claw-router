package com.sdkwork.clawrouter.backend.model;


public class SkillsCategoriesUpdateResult {
    private String code;
    private AdminSkillCategoryMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillCategoryMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillCategoryMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
