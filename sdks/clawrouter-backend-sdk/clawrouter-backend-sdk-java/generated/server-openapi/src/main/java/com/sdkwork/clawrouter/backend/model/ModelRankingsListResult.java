package com.sdkwork.clawrouter.backend.model;


public class ModelRankingsListResult {
    private String code;
    private ModelRankingsSnapshot data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public ModelRankingsSnapshot getData() {
        return this.data;
    }
    
    public void setData(ModelRankingsSnapshot data) {
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
