package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAccessGroupChannelBindingsResponse {
    private List<AdminAccessGroupChannelBindingItem> items;

    public List<AdminAccessGroupChannelBindingItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminAccessGroupChannelBindingItem> items) {
        this.items = items;
    }
}
