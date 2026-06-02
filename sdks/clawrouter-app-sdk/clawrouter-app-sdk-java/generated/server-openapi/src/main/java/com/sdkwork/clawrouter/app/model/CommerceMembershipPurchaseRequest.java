package com.sdkwork.clawrouter.app.model;


public class CommerceMembershipPurchaseRequest {
    private String couponId;
    private Integer packageId;

    public String getCouponId() {
        return this.couponId;
    }

    public void setCouponId(String couponId) {
        this.couponId = couponId;
    }

    public Integer getPackageId() {
        return this.packageId;
    }

    public void setPackageId(Integer packageId) {
        this.packageId = packageId;
    }
}
