package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminBillingRecordsResponse {
    private List<AdminBillingRecordItem> items;

    public List<AdminBillingRecordItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminBillingRecordItem> items) {
        this.items = items;
    }
}
