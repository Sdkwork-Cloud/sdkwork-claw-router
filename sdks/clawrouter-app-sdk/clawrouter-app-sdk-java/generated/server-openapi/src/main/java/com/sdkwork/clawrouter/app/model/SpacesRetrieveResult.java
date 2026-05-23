package com.sdkwork.clawrouter.app.model;


public class SpacesRetrieveResult {
    private String code;
    private MemorySpaceItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MemorySpaceItem getData() {
        return this.data;
    }

    public void setData(MemorySpaceItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
