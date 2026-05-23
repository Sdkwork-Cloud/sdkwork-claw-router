package com.sdkwork.clawrouter.app.model;


public class AgentRunsSubmitResult {
    private String code;
    private AgentRunResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentRunResponse getData() {
        return this.data;
    }

    public void setData(AgentRunResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
