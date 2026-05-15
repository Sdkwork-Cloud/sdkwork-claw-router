package com.sdkwork.clawrouter.app.model;


public class CommerceVipPackItem {
    private String code;
    private String currencyCode;
    private String id;
    private String name;
    private String priceAmount;
    private String status;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }
    
    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getPriceAmount() {
        return this.priceAmount;
    }
    
    public void setPriceAmount(String priceAmount) {
        this.priceAmount = priceAmount;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
