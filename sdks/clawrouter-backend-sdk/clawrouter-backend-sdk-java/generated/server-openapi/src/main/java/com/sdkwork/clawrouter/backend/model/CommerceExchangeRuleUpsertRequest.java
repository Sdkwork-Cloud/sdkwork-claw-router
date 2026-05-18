package com.sdkwork.clawrouter.backend.model;


public class CommerceExchangeRuleUpsertRequest {
    private String rate;
    private String sourceAssetType;
    private String status;
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

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTargetAssetType() {
        return this.targetAssetType;
    }
    
    public void setTargetAssetType(String targetAssetType) {
        this.targetAssetType = targetAssetType;
    }
}
