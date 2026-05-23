package com.sdkwork.clawrouter.backend.model;


public class SkillsPackageDeleteResult {
    private String code;
    private AdminSkillPackageDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSkillPackageDeleteResponse getData() {
        return this.data;
    }

    public void setData(AdminSkillPackageDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
