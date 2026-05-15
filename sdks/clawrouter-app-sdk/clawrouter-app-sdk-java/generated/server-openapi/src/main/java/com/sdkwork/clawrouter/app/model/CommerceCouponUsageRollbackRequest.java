package com.sdkwork.clawrouter.app.model;


public class CommerceCouponUsageRollbackRequest {
    private String reason;
    private String requestNo;
    private String usageNo;

    public String getReason() {
        return this.reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRequestNo() {
        return this.requestNo;
    }
    
    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getUsageNo() {
        return this.usageNo;
    }
    
    public void setUsageNo(String usageNo) {
        this.usageNo = usageNo;
    }
}
