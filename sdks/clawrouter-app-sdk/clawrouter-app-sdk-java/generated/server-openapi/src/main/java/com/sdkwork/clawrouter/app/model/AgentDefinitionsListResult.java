package com.sdkwork.clawrouter.app.model;


public class AgentDefinitionsListResult {
    private String code;
    private AgentListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentListResponse getData() {
        return this.data;
    }

    public void setData(AgentListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
