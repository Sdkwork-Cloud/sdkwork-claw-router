package com.sdkwork.clawrouter.app.model;


public class SkillsEnableResult {
    private String code;
    private AppInstalledSkillResponse data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public AppInstalledSkillResponse getData() {
        return this.data;
    }
    
    public void setData(AppInstalledSkillResponse data) {
        this.data = data;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public String getMsg() {
        return this.msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
}
