package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class VipLevelsListResult {
    private String code;
    private List<CommerceVipLevelItem> data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public List<CommerceVipLevelItem> getData() {
        return this.data;
    }
    
    public void setData(List<CommerceVipLevelItem> data) {
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
