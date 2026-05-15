package com.sdkwork.clawrouter.backend.model;


public class AdminRechargeRecordItem {
    private String amount;
    private String id;
    private String method;
    private String status;
    private String time;
    private String tradeNo;
    private String usdCredited;
    private String user;
    private String userId;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getMethod() {
        return this.method;
    }
    
    public void setMethod(String method) {
        this.method = method;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTime() {
        return this.time;
    }
    
    public void setTime(String time) {
        this.time = time;
    }

    public String getTradeNo() {
        return this.tradeNo;
    }
    
    public void setTradeNo(String tradeNo) {
        this.tradeNo = tradeNo;
    }

    public String getUsdCredited() {
        return this.usdCredited;
    }
    
    public void setUsdCredited(String usdCredited) {
        this.usdCredited = usdCredited;
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
