package com.sdkwork.clawrouter.app.model;


public class PositionAssignmentsListResult {
    private String code;
    private IamPositionAssignmentListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamPositionAssignmentListResponse getData() {
        return this.data;
    }

    public void setData(IamPositionAssignmentListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
