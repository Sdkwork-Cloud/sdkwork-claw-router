package com.sdkwork.clawrouter.app.model;


public class RoleBindingsListResult {
    private String code;
    private IamRoleBindingListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamRoleBindingListResponse getData() {
        return this.data;
    }

    public void setData(IamRoleBindingListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
