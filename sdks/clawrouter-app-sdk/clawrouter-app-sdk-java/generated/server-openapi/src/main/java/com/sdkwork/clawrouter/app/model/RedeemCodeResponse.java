package com.sdkwork.clawrouter.app.model;


public class RedeemCodeResponse {
    private String amount;
    private Integer balance;
    private Integer creditedPoints;
    private String message;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public Integer getBalance() {
        return this.balance;
    }
    
    public void setBalance(Integer balance) {
        this.balance = balance;
    }

    public Integer getCreditedPoints() {
        return this.creditedPoints;
    }
    
    public void setCreditedPoints(Integer creditedPoints) {
        this.creditedPoints = creditedPoints;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
