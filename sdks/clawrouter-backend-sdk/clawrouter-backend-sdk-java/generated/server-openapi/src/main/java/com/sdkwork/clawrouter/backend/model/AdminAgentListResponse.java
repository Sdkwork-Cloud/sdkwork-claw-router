package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAgentListResponse {
    private List<AdminAgentItem> items;

    public List<AdminAgentItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminAgentItem> items) {
        this.items = items;
    }
}
