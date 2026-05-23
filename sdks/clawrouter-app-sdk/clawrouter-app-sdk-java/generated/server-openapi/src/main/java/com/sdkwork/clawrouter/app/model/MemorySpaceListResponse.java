package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class MemorySpaceListResponse {
    private List<MemorySpaceItem> items;

    public List<MemorySpaceItem> getItems() {
        return this.items;
    }

    public void setItems(List<MemorySpaceItem> items) {
        this.items = items;
    }
}
