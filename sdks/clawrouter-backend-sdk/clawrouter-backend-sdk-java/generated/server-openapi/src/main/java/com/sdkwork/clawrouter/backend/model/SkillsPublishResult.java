package com.sdkwork.clawrouter.backend.model;


public class SkillsPublishResult {
    private String code;
    private AdminSkillMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
