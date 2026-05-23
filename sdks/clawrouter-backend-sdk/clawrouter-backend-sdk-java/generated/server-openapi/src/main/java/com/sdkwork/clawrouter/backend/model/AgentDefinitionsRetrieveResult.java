package com.sdkwork.clawrouter.backend.model;


public class AgentDefinitionsRetrieveResult {
    private String code;
    private AdminAgentItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAgentItem getData() {
        return this.data;
    }

    public void setData(AdminAgentItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
