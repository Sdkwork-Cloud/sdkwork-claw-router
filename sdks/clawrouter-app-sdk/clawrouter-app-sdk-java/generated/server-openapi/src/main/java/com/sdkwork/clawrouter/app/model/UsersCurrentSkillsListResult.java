package com.sdkwork.clawrouter.app.model;


public class UsersCurrentSkillsListResult {
    private String code;
    private AppInstalledSkillsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AppInstalledSkillsResponse getData() {
        return this.data;
    }

    public void setData(AppInstalledSkillsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
