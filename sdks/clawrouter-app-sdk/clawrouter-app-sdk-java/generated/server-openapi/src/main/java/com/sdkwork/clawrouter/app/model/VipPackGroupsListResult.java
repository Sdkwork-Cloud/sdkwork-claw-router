package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class VipPackGroupsListResult {
    private String code;
    private List<CommerceVipPackGroupItem> data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public List<CommerceVipPackGroupItem> getData() {
        return this.data;
    }
    
    public void setData(List<CommerceVipPackGroupItem> data) {
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
