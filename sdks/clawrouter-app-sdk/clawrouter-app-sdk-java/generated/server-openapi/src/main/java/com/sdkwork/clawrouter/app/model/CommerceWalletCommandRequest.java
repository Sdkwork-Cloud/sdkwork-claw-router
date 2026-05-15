package com.sdkwork.clawrouter.app.model;


public class CommerceWalletCommandRequest {
    private String amount;
    private String assetType;
    private String remarks;
    private String requestNo;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getAssetType() {
        return this.assetType;
    }
    
    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getRemarks() {
        return this.remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getRequestNo() {
        return this.requestNo;
    }
    
    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }
}
