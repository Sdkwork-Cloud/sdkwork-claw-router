package com.sdkwork.clawrouter.backend.model;


public class AdminCouponBatchGenerateRequest {
    private Integer count;
    private Integer couponId;
    private String name;
    private String prefix;

    public Integer getCount() {
        return this.count;
    }
    
    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getCouponId() {
        return this.couponId;
    }
    
    public void setCouponId(Integer couponId) {
        this.couponId = couponId;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getPrefix() {
        return this.prefix;
    }
    
    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
}
