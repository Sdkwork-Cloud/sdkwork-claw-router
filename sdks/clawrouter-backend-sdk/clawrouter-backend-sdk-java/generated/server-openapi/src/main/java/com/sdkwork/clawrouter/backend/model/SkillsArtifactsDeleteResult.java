package com.sdkwork.clawrouter.backend.model;


public class SkillsArtifactsDeleteResult {
    private String code;
    private AdminSkillArtifactDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillArtifactDeleteResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillArtifactDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
