package com.sdkwork.clawrouter.app.model;


public class CommerceCouponClaimRequest {
    private String claimSource;
    private String couponId;

    public String getClaimSource() {
        return this.claimSource;
    }
    
    public void setClaimSource(String claimSource) {
        this.claimSource = claimSource;
    }

    public String getCouponId() {
        return this.couponId;
    }
    
    public void setCouponId(String couponId) {
        this.couponId = couponId;
    }
}
