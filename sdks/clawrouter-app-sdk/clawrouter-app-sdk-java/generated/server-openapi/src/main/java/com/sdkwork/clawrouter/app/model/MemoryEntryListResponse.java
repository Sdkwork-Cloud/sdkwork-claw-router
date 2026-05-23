package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class MemoryEntryListResponse {
    private List<MemoryEntryItem> items;

    public List<MemoryEntryItem> getItems() {
        return this.items;
    }

    public void setItems(List<MemoryEntryItem> items) {
        this.items = items;
    }
}
