package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AgentRunListResponse {
    private List<AgentRunItem> items;

    public List<AgentRunItem> getItems() {
        return this.items;
    }

    public void setItems(List<AgentRunItem> items) {
        this.items = items;
    }
}
