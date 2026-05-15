package com.sdkwork.clawrouter.backend.model;


public class AdminBillingRecordItem {
    private String dueDate;
    private String id;
    private String period;
    private String status;
    private String totalCost;
    private Integer totalTokens;
    private String userId;

    public String getDueDate() {
        return this.dueDate;
    }
    
    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getPeriod() {
        return this.period;
    }
    
    public void setPeriod(String period) {
        this.period = period;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTotalCost() {
        return this.totalCost;
    }
    
    public void setTotalCost(String totalCost) {
        this.totalCost = totalCost;
    }

    public Integer getTotalTokens() {
        return this.totalTokens;
    }
    
    public void setTotalTokens(Integer totalTokens) {
        this.totalTokens = totalTokens;
    }

    public String getUserId() {
        return this.userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
