package com.sdkwork.clawrouter.app.model;


public class IamPasswordResetRequestCreateRequest {
    private String account;
    private String channel;

    public String getAccount() {
        return this.account;
    }
    
    public void setAccount(String account) {
        this.account = account;
    }

    public String getChannel() {
        return this.channel;
    }
    
    public void setChannel(String channel) {
        this.channel = channel;
    }
}
