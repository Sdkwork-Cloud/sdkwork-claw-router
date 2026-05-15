package com.sdkwork.clawrouter.app.model;


public class CommercePointsExchangeRateResponse {
    private String rate;
    private String sourceAssetType;
    private String targetAssetType;

    public String getRate() {
        return this.rate;
    }
    
    public void setRate(String rate) {
        this.rate = rate;
    }

    public String getSourceAssetType() {
        return this.sourceAssetType;
    }
    
    public void setSourceAssetType(String sourceAssetType) {
        this.sourceAssetType = sourceAssetType;
    }

    public String getTargetAssetType() {
        return this.targetAssetType;
    }
    
    public void setTargetAssetType(String targetAssetType) {
        this.targetAssetType = targetAssetType;
    }
}
