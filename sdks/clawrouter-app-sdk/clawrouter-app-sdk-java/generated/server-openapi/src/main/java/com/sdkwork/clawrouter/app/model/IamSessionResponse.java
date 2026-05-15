package com.sdkwork.clawrouter.app.model;


public class IamSessionResponse {
    private String accessToken;
    private String authToken;
    private IamAppContext context;
    private String expiresAt;
    private String refreshToken;
    private String sessionId;
    private IamUserResponse user;

    public String getAccessToken() {
        return this.accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAuthToken() {
        return this.authToken;
    }
    
    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public IamAppContext getContext() {
        return this.context;
    }
    
    public void setContext(IamAppContext context) {
        this.context = context;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }
    
    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getRefreshToken() {
        return this.refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getSessionId() {
        return this.sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public IamUserResponse getUser() {
        return this.user;
    }
    
    public void setUser(IamUserResponse user) {
        this.user = user;
    }
}
