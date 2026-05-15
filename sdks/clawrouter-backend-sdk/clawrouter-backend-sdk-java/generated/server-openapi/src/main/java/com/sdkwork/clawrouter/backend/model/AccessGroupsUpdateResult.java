package com.sdkwork.clawrouter.backend.model;


public class AccessGroupsUpdateResult {
    private String code;
    private AdminAccessGroupMutationResponse data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public AdminAccessGroupMutationResponse getData() {
        return this.data;
    }
    
    public void setData(AdminAccessGroupMutationResponse data) {
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
