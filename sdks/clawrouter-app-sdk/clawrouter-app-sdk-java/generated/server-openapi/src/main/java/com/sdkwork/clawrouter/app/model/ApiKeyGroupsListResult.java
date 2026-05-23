package com.sdkwork.clawrouter.app.model;


public class ApiKeyGroupsListResult {
    private String code;
    private AppApiKeyGroupListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AppApiKeyGroupListResponse getData() {
        return this.data;
    }

    public void setData(AppApiKeyGroupListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
