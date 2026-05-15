package com.sdkwork.clawrouter.app.model;


public class IamSessionRefreshRequest {
    private String refreshToken;

    public String getRefreshToken() {
        return this.refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
