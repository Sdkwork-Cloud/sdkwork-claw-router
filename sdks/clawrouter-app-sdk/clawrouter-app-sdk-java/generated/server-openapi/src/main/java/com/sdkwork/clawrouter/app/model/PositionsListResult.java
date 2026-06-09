package com.sdkwork.clawrouter.app.model;


public class PositionsListResult {
    private String code;
    private IamPositionListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamPositionListResponse getData() {
        return this.data;
    }

    public void setData(IamPositionListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
