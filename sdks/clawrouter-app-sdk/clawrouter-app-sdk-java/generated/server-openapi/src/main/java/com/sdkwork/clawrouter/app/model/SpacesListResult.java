package com.sdkwork.clawrouter.app.model;


public class SpacesListResult {
    private String code;
    private MemorySpaceListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MemorySpaceListResponse getData() {
        return this.data;
    }

    public void setData(MemorySpaceListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
