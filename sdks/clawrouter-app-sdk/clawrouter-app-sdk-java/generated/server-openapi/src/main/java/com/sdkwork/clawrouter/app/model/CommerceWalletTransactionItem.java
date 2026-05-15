package com.sdkwork.clawrouter.app.model;


public class CommerceWalletTransactionItem {
    private String amount;
    private String balanceAfter;
    private String businessType;
    private String createdAt;
    private String direction;
    private String id;
    private String transactionNo;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getBalanceAfter() {
        return this.balanceAfter;
    }
    
    public void setBalanceAfter(String balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public String getBusinessType() {
        return this.businessType;
    }
    
    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDirection() {
        return this.direction;
    }
    
    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getTransactionNo() {
        return this.transactionNo;
    }
    
    public void setTransactionNo(String transactionNo) {
        this.transactionNo = transactionNo;
    }
}
