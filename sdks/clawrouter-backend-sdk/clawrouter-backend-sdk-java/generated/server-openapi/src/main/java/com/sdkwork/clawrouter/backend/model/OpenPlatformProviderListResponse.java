package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class OpenPlatformProviderListResponse {
    private List<OpenPlatformProviderItem> items;

    public List<OpenPlatformProviderItem> getItems() {
        return this.items;
    }

    public void setItems(List<OpenPlatformProviderItem> items) {
        this.items = items;
    }
}
