package com.sdkwork.clawrouter.app.model;


public class SkillsRetrieveResult {
    private String code;
    private SkillDetailResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public SkillDetailResponse getData() {
        return this.data;
    }

    public void setData(SkillDetailResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
