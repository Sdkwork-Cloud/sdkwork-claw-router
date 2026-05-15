package com.sdkwork.clawrouter.app.model;


public class CommerceCouponUsageRequest {
    private String amount;
    private String businessNo;
    private String requestNo;
    private String userCouponId;

    public String getAmount() {
        return this.amount;
    }
    
    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getBusinessNo() {
        return this.businessNo;
    }
    
    public void setBusinessNo(String businessNo) {
        this.businessNo = businessNo;
    }

    public String getRequestNo() {
        return this.requestNo;
    }
    
    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    public String getUserCouponId() {
        return this.userCouponId;
    }
    
    public void setUserCouponId(String userCouponId) {
        this.userCouponId = userCouponId;
    }
}
