package com.sdkwork.clawrouter.app.model;


public class DepartmentsListResult {
    private String code;
    private IamDepartmentListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamDepartmentListResponse getData() {
        return this.data;
    }

    public void setData(IamDepartmentListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
