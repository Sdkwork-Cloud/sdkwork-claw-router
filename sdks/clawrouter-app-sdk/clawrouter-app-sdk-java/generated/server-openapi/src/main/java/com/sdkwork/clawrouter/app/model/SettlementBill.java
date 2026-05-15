package com.sdkwork.clawrouter.app.model;


public class SettlementBill {
    private SettlementBillBreakdown breakdown;
    private String endDate;
    private String id;
    private String period;
    private String startDate;
    private String status;
    private String totalCost;
    private String totalTokens;

    public SettlementBillBreakdown getBreakdown() {
        return this.breakdown;
    }
    
    public void setBreakdown(SettlementBillBreakdown breakdown) {
        this.breakdown = breakdown;
    }

    public String getEndDate() {
        return this.endDate;
    }
    
    public void setEndDate(String endDate) {
        this.endDate = endDate;
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

    public String getStartDate() {
        return this.startDate;
    }
    
    public void setStartDate(String startDate) {
        this.startDate = startDate;
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

    public String getTotalTokens() {
        return this.totalTokens;
    }
    
    public void setTotalTokens(String totalTokens) {
        this.totalTokens = totalTokens;
    }
}
