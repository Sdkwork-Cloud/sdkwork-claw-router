package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCouponsResponse {
    private List<AdminCouponItem> items;

    public List<AdminCouponItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminCouponItem> items) {
        this.items = items;
    }
}
