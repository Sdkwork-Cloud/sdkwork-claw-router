package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppCatalogResponse {
    private List<AppCatalogItem> items;

    public List<AppCatalogItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AppCatalogItem> items) {
        this.items = items;
    }
}
