package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminRedemptionRecordsResponse {
    private List<AdminRedemptionRecordItem> items;

    public List<AdminRedemptionRecordItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminRedemptionRecordItem> items) {
        this.items = items;
    }
}
