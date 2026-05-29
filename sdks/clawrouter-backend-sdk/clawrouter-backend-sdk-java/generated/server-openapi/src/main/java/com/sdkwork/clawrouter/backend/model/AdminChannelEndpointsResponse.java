package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminChannelEndpointsResponse {
    private List<AdminChannelEndpointItem> items;

    public List<AdminChannelEndpointItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminChannelEndpointItem> items) {
        this.items = items;
    }
}
