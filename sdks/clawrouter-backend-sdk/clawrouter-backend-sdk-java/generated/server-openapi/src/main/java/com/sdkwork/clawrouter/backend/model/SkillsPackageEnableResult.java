package com.sdkwork.clawrouter.backend.model;


public class SkillsPackageEnableResult {
    private String code;
    private AdminSkillPackageMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillPackageMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillPackageMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
