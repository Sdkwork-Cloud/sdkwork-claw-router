package com.sdkwork.clawrouter.app.model;


public class AgentSessionsRetrieveResult {
    private String code;
    private AgentSessionItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentSessionItem getData() {
        return this.data;
    }

    public void setData(AgentSessionItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
