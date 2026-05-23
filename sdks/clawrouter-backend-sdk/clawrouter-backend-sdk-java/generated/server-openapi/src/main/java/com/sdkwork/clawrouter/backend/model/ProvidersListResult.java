package com.sdkwork.clawrouter.backend.model;


public class ProvidersListResult {
    private String code;
    private OpenPlatformProviderListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OpenPlatformProviderListResponse getData() {
        return this.data;
    }

    public void setData(OpenPlatformProviderListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
