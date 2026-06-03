package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSiteModelsReplaceRequest {
    private List<AdminSiteModelCreateRequest> items;

    public List<AdminSiteModelCreateRequest> getItems() {
        return this.items;
    }

    public void setItems(List<AdminSiteModelCreateRequest> items) {
        this.items = items;
    }
}
