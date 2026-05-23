package com.sdkwork.clawrouter.app.model;


public class AgentRunStepsListResult {
    private String code;
    private AgentRunStepListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentRunStepListResponse getData() {
        return this.data;
    }

    public void setData(AgentRunStepListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
