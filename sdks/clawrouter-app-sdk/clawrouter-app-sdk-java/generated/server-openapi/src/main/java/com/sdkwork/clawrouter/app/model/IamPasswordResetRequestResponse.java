package com.sdkwork.clawrouter.app.model;


public class IamPasswordResetRequestResponse {
    private String debugCode;
    private String expiresAt;
    private String requestId;

    public String getDebugCode() {
        return this.debugCode;
    }

    public void setDebugCode(String debugCode) {
        this.debugCode = debugCode;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getRequestId() {
        return this.requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
}
