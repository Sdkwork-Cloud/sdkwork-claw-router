package com.sdkwork.clawrouter.backend.model;


public class UsersCreateResult {
    private String code;
    private AdminUserMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminUserMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminUserMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
