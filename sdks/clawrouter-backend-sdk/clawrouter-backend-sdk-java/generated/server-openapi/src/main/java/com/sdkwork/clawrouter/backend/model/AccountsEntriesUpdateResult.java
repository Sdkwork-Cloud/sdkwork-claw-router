package com.sdkwork.clawrouter.backend.model;


public class AccountsEntriesUpdateResult {
    private String code;
    private OpenPlatformEntryResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformEntryResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformEntryResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
