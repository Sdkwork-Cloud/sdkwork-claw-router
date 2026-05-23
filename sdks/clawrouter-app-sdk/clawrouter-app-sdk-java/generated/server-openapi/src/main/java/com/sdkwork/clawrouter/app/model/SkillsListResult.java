package com.sdkwork.clawrouter.app.model;


public class SkillsListResult {
    private String code;
    private SkillsCatalogResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public SkillsCatalogResponse getData() {
        return this.data;
    }

    public void setData(SkillsCatalogResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
