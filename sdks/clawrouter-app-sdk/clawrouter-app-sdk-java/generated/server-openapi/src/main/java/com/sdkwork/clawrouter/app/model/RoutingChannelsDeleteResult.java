package com.sdkwork.clawrouter.app.model;


public class RoutingChannelsDeleteResult {
    private String code;
    private RoutingChannelDeleteResponse data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public RoutingChannelDeleteResponse getData() {
        return this.data;
    }
    
    public void setData(RoutingChannelDeleteResponse data) {
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
