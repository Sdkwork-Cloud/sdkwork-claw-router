package com.sdkwork.clawrouter.app.model;


public class AgentRunsRetrieveResult {
    private String code;
    private AgentRunItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentRunItem getData() {
        return this.data;
    }

    public void setData(AgentRunItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
