package com.sdkwork.clawrouter.backend.model;


public class SkillsPackageListResult {
    private String code;
    private AdminSkillPackageListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillPackageListResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillPackageListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
