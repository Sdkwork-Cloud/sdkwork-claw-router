package com.sdkwork.clawrouter.app.model;


public class IamVerificationCodeCreateRequest {
    private String scene;
    private String target;
    private String verifyType;

    public String getScene() {
        return this.scene;
    }
    
    public void setScene(String scene) {
        this.scene = scene;
    }

    public String getTarget() {
        return this.target;
    }
    
    public void setTarget(String target) {
        this.target = target;
    }

    public String getVerifyType() {
        return this.verifyType;
    }
    
    public void setVerifyType(String verifyType) {
        this.verifyType = verifyType;
    }
}
