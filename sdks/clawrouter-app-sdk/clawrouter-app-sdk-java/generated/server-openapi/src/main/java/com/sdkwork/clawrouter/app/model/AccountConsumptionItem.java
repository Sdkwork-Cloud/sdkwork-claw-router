package com.sdkwork.clawrouter.app.model;


public class AccountConsumptionItem {
    private String color;
    private String name;
    private Double percentage;
    private Double value;

    public String getColor() {
        return this.color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public Double getPercentage() {
        return this.percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Double getValue() {
        return this.value;
    }
    
    public void setValue(Double value) {
        this.value = value;
    }
}
