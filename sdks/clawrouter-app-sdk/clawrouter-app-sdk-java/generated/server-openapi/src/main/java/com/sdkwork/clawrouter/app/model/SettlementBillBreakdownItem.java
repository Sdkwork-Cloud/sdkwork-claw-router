package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class SettlementBillBreakdownItem {
    private String cost;
    private List<String> models;
    private String usage;

    public String getCost() {
        return this.cost;
    }
    
    public void setCost(String cost) {
        this.cost = cost;
    }

    public List<String> getModels() {
        return this.models;
    }
    
    public void setModels(List<String> models) {
        this.models = models;
    }

    public String getUsage() {
        return this.usage;
    }
    
    public void setUsage(String usage) {
        this.usage = usage;
    }
}
