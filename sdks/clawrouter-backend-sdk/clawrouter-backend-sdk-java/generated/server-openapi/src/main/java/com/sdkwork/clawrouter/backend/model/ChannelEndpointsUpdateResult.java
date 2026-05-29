package com.sdkwork.clawrouter.backend.model;


public class ChannelEndpointsUpdateResult {
    private String code;
    private AdminChannelEndpointMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminChannelEndpointMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminChannelEndpointMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
