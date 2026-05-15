package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ProvidersResponse {
    private List<ProviderConfig> items;

    public List<ProviderConfig> getItems() {
        return this.items;
    }
    
    public void setItems(List<ProviderConfig> items) {
        this.items = items;
    }
}
