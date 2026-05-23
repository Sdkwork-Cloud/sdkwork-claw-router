package com.sdkwork.clawrouter.app.model;


public class SpacesCreateResult {
    private String code;
    private MemorySpaceResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MemorySpaceResponse getData() {
        return this.data;
    }

    public void setData(MemorySpaceResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
