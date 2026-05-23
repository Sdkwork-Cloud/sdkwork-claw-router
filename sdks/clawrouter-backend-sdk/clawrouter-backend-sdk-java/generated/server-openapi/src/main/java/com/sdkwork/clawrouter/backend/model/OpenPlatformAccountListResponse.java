package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class OpenPlatformAccountListResponse {
    private List<OpenPlatformAccountItem> items;

    public List<OpenPlatformAccountItem> getItems() {
        return this.items;
    }

    public void setItems(List<OpenPlatformAccountItem> items) {
        this.items = items;
    }
}
