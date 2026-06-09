package com.sdkwork.clawrouter.app.model;


public class DepartmentsTreeRetrieveResult {
    private String code;
    private IamDepartmentTreeResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamDepartmentTreeResponse getData() {
        return this.data;
    }

    public void setData(IamDepartmentTreeResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
