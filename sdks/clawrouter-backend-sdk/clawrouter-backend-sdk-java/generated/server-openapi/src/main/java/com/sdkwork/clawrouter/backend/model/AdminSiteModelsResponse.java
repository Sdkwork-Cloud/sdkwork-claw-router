package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSiteModelsResponse {
    private List<AdminSiteModelItem> items;

    public List<AdminSiteModelItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminSiteModelItem> items) {
        this.items = items;
    }
}
