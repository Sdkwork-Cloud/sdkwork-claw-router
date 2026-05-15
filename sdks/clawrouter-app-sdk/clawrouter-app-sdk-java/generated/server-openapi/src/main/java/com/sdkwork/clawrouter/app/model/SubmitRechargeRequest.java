package com.sdkwork.clawrouter.app.model;


public class SubmitRechargeRequest {
    private String amount;
    private String method;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getMethod() {
        return this.method;
    }
    
    public void setMethod(String method) {
        this.method = method;
    }
}
