package com.sdkwork.clawrouter.app.model;


public class AgentSessionsCreateResult {
    private String code;
    private AgentSessionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentSessionResponse getData() {
        return this.data;
    }

    public void setData(AgentSessionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
