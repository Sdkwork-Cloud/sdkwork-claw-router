package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAppCategoryListResponse {
    private List<AdminAppCategoryItem> items;

    public List<AdminAppCategoryItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminAppCategoryItem> items) {
        this.items = items;
    }
}
