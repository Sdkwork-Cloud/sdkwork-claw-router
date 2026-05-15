package com.sdkwork.clawrouter.app.model;


public class CommercePointsHistoryItem {
    private Integer amount;
    private Integer balanceAfter;
    private String businessType;
    private String createdAt;
    private String direction;
    private String id;

    public Integer getAmount() {
        return this.amount;
    }
    
    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Integer getBalanceAfter() {
        return this.balanceAfter;
    }
    
    public void setBalanceAfter(Integer balanceAfter) {
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
}
