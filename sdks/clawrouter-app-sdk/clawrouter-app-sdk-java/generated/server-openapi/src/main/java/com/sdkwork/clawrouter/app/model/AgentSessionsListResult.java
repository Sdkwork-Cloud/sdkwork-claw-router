package com.sdkwork.clawrouter.app.model;


public class AgentSessionsListResult {
    private String code;
    private AgentSessionListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentSessionListResponse getData() {
        return this.data;
    }

    public void setData(AgentSessionListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
