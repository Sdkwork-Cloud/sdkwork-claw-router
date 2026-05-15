package com.sdkwork.clawrouter.app.model;


public class IamVerificationCodeVerifyResponse {
    private Boolean valid;
    private Boolean verified;

    public Boolean getValid() {
        return this.valid;
    }
    
    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public Boolean getVerified() {
        return this.verified;
    }
    
    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
