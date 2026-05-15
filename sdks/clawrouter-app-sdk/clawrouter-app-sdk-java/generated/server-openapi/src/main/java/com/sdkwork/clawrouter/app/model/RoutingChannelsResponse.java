package com.sdkwork.clawrouter.app.model;

import java.util.List;
import java.util.Map;

public class RoutingChannelsResponse {
    private List<Map<String, Object>> items;

    public List<Map<String, Object>> getItems() {
        return this.items;
    }
    
    public void setItems(List<Map<String, Object>> items) {
        this.items = items;
    }
}
