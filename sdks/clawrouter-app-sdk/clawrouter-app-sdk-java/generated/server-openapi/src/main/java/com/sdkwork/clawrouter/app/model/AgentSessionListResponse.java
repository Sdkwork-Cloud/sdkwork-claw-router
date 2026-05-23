package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AgentSessionListResponse {
    private List<AgentSessionItem> items;

    public List<AgentSessionItem> getItems() {
        return this.items;
    }

    public void setItems(List<AgentSessionItem> items) {
        this.items = items;
    }
}
