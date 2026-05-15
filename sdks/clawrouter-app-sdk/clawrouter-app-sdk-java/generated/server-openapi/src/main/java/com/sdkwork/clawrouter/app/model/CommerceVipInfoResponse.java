package com.sdkwork.clawrouter.app.model;


public class CommerceVipInfoResponse {
    private String levelCode;
    private String levelName;
    private String status;

    public String getLevelCode() {
        return this.levelCode;
    }
    
    public void setLevelCode(String levelCode) {
        this.levelCode = levelCode;
    }

    public String getLevelName() {
        return this.levelName;
    }
    
    public void setLevelName(String levelName) {
        this.levelName = levelName;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
