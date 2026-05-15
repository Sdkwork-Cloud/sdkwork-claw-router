package com.sdkwork.clawrouter.app.model;


public class CommerceWalletAccountItem {
    private String assetType;
    private String availableAmount;
    private String currencyCode;
    private String frozenAmount;
    private String id;
    private String status;

    public String getAssetType() {
        return this.assetType;
    }
    
    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

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

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
