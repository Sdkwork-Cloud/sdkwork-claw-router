package com.sdkwork.clawrouter.app.model;


public class SkillsCategoriesListResult {
    private String code;
    private SkillCategoriesResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public SkillCategoriesResponse getData() {
        return this.data;
    }

    public void setData(SkillCategoriesResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
