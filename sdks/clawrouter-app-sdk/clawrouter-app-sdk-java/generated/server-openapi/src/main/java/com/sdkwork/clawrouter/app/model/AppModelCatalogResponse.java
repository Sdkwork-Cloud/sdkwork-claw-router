package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppModelCatalogResponse {
    private List<AppModelCatalogGroupOption> groups;
    private List<AppModelCatalogItem> items;

    public List<AppModelCatalogGroupOption> getGroups() {
        return this.groups;
    }

    public void setGroups(List<AppModelCatalogGroupOption> groups) {
        this.groups = groups;
    }

    public List<AppModelCatalogItem> getItems() {
        return this.items;
    }

    public void setItems(List<AppModelCatalogItem> items) {
        this.items = items;
    }
}
