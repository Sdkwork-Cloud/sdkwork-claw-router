package com.sdkwork.clawrouter.app.model;


public class DepartmentAssignmentsListResult {
    private String code;
    private IamDepartmentAssignmentListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamDepartmentAssignmentListResponse getData() {
        return this.data;
    }

    public void setData(IamDepartmentAssignmentListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
