package com.sdkwork.clawrouter.app.model;


public class AgentDefinitionsCreateResult {
    private String code;
    private AgentItemResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentItemResponse getData() {
        return this.data;
    }

    public void setData(AgentItemResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
