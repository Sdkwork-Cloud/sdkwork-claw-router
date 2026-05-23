package com.sdkwork.clawrouter.app.model;


public class EntriesCreateResult {
    private String code;
    private MemoryEntryResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MemoryEntryResponse getData() {
        return this.data;
    }

    public void setData(MemoryEntryResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
