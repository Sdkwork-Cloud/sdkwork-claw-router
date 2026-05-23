package com.sdkwork.clawrouter.app.model;


public class EntriesRetrieveResult {
    private String code;
    private MemoryEntryItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MemoryEntryItem getData() {
        return this.data;
    }

    public void setData(MemoryEntryItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
