package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminRechargeRecordsResponse {
    private List<AdminRechargeRecordItem> items;

    public List<AdminRechargeRecordItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminRechargeRecordItem> items) {
        this.items = items;
    }
}
