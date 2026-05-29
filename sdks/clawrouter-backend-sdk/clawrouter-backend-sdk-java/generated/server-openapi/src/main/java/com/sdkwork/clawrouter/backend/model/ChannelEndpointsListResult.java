package com.sdkwork.clawrouter.backend.model;


public class ChannelEndpointsListResult {
    private String code;
    private AdminChannelEndpointsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminChannelEndpointsResponse getData() {
        return this.data;
    }

    public void setData(AdminChannelEndpointsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
