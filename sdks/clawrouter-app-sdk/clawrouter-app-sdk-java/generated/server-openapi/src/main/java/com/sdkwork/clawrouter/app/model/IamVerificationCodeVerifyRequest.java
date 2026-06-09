package com.sdkwork.clawrouter.app.model;


public class IamVerificationCodeVerifyRequest {
    private String code;
    private String codeId;
    private String scene;
    private String target;
    private String verifyType;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeId() {
        return this.codeId;
    }

    public void setCodeId(String codeId) {
        this.codeId = codeId;
    }

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
