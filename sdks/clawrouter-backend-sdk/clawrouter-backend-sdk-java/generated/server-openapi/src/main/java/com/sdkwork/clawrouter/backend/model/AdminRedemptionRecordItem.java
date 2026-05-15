package com.sdkwork.clawrouter.backend.model;


public class AdminRedemptionRecordItem {
    private String amount;
    private String code;
    private String id;
    private String time;
    private String user;
    private String userId;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getTime() {
        return this.time;
    }
    
    public void setTime(String time) {
        this.time = time;
    }

    public String getUser() {
        return this.user;
    }
    
    public void setUser(String user) {
        this.user = user;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
