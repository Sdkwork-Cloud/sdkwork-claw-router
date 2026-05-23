package com.sdkwork.clawrouter.app.model;


public class EntriesListResult {
    private String code;
    private MemoryEntryListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MemoryEntryListResponse getData() {
        return this.data;
    }

    public void setData(MemoryEntryListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
