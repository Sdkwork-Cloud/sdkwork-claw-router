package com.sdkwork.clawrouter.backend.model;


public class AccountsEntriesListResult {
    private String code;
    private OpenPlatformEntryListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformEntryListResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformEntryListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
