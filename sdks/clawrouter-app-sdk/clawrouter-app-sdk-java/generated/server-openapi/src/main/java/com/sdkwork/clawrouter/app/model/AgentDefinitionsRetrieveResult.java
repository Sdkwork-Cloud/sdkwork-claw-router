package com.sdkwork.clawrouter.app.model;


public class AgentDefinitionsRetrieveResult {
    private String code;
    private AgentItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AgentItem getData() {
        return this.data;
    }

    public void setData(AgentItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
