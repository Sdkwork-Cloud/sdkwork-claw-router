package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminTransactionsResponse {
    private List<AdminTransactionRecordItem> items;

    public List<AdminTransactionRecordItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminTransactionRecordItem> items) {
        this.items = items;
    }
}
