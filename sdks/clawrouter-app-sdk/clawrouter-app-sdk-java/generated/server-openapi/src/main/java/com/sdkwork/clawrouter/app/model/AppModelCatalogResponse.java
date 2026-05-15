package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppModelCatalogResponse {
    private List<AppModelCatalogItem> items;

    public List<AppModelCatalogItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AppModelCatalogItem> items) {
        this.items = items;
    }
}
