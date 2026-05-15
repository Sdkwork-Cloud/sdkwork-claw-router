package com.sdkwork.clawrouter.app.model;


public class IamLoginQrCodeStatusResponse {
    private IamSessionResponse session;
    private String status;
    private IamSessionResponse token;
    private IamUserResponse userInfo;

    public IamSessionResponse getSession() {
        return this.session;
    }
    
    public void setSession(IamSessionResponse session) {
        this.session = session;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public IamSessionResponse getToken() {
        return this.token;
    }
    
    public void setToken(IamSessionResponse token) {
        this.token = token;
    }

    public IamUserResponse getUserInfo() {
        return this.userInfo;
    }
    
    public void setUserInfo(IamUserResponse userInfo) {
        this.userInfo = userInfo;
    }
}
