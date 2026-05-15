package com.sdkwork.clawrouter.app.model;


public class IamVerificationCodeResponse {
    private String codeId;
    private String debugCode;
    private String expiresAt;

    public String getCodeId() {
        return this.codeId;
    }
    
    public void setCodeId(String codeId) {
        this.codeId = codeId;
    }

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
}
