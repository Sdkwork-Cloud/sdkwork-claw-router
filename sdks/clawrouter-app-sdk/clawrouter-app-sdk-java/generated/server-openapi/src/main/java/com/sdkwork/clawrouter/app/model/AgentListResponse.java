package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AgentListResponse {
    private List<AgentItem> items;

    public List<AgentItem> getItems() {
        return this.items;
    }

    public void setItems(List<AgentItem> items) {
        this.items = items;
    }
}
