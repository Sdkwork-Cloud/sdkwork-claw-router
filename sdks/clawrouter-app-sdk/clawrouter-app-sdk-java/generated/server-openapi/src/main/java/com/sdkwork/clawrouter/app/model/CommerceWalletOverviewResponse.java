package com.sdkwork.clawrouter.app.model;


public class CommerceWalletOverviewResponse {
    private String availableAmount;
    private String currencyCode;
    private String frozenAmount;

    public String getAvailableAmount() {
        return this.availableAmount;
    }
    
    public void setAvailableAmount(String availableAmount) {
        this.availableAmount = availableAmount;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }
    
    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getFrozenAmount() {
        return this.frozenAmount;
    }
    
    public void setFrozenAmount(String frozenAmount) {
        this.frozenAmount = frozenAmount;
    }
}
