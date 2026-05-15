package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCouponBatchesResponse {
    private List<AdminCouponBatchItem> items;

    public List<AdminCouponBatchItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminCouponBatchItem> items) {
        this.items = items;
    }
}
