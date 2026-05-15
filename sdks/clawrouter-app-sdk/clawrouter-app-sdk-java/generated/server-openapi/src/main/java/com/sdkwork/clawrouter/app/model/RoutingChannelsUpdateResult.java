package com.sdkwork.clawrouter.app.model;


public class RoutingChannelsUpdateResult {
    private String code;
    private RoutingChannelMutationResponse data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public RoutingChannelMutationResponse getData() {
        return this.data;
    }
    
    public void setData(RoutingChannelMutationResponse data) {
        this.data = data;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public String getMsg() {
        return this.msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
}
