package com.sdkwork.clawrouter.app.model;


public class CommerceVipPurchaseRequest {
    private String packId;
    private String remarks;
    private String requestNo;

    public String getPackId() {
        return this.packId;
    }
    
    public void setPackId(String packId) {
        this.packId = packId;
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
