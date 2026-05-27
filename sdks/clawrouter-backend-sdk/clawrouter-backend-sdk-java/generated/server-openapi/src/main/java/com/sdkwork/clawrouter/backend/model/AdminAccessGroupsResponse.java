package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAccessGroupsResponse {
    private List<AdminAccessGroupItem> items;

    public List<AdminAccessGroupItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminAccessGroupItem> items) {
        this.items = items;
    }
}
