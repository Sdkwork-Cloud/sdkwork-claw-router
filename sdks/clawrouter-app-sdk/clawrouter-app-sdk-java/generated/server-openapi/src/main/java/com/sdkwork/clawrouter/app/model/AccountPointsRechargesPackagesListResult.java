package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AccountPointsRechargesPackagesListResult {
    private String code;
    private List<RechargePackage> data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public List<RechargePackage> getData() {
        return this.data;
    }
    
    public void setData(List<RechargePackage> data) {
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
