package com.sdkwork.clawrouter.backend.model;


public class AdminCouponBatchItem {
    private Integer count;
    private String couponId;
    private String createdAt;
    private String id;
    private String name;
    private String prefix;

    public Integer getCount() {
        return this.count;
    }
    
    public void setCount(Integer count) {
        this.count = count;
    }

    public String getCouponId() {
        return this.couponId;
    }
    
    public void setCouponId(String couponId) {
        this.couponId = couponId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
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
