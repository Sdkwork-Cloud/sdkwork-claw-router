package com.sdkwork.clawrouter.app.model;


public class SkillsConfigUpdateResult {
    private String code;
    private AppInstalledSkillResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AppInstalledSkillResponse getData() {
        return this.data;
    }

    public void setData(AppInstalledSkillResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
