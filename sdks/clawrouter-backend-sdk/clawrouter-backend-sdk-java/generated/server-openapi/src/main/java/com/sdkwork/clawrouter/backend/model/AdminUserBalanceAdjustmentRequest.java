package com.sdkwork.clawrouter.backend.model;


public class AdminUserBalanceAdjustmentRequest {
    private Double amount;
    private String type;

    public Double getAmount() {
        return this.amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getType() {
        return this.type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
}
