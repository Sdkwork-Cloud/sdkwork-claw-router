package com.sdkwork.clawrouter.app.model;


public class AgentRunStepsSubmitResult {
    private String code;
    private AgentRunStepResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentRunStepResponse getData() {
        return this.data;
    }

    public void setData(AgentRunStepResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
