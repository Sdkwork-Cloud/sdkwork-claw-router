package com.sdkwork.clawrouter.backend.model;


public class AccessGroupsChannelBindingsListResult {
    private String code;
    private AdminAccessGroupChannelBindingsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAccessGroupChannelBindingsResponse getData() {
        return this.data;
    }

    public void setData(AdminAccessGroupChannelBindingsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
