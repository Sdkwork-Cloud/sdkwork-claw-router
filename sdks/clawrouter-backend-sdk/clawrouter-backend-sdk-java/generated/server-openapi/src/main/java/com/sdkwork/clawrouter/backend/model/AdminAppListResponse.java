package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAppListResponse {
    private List<AdminAppItemResponse> items;

    public List<AdminAppItemResponse> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminAppItemResponse> items) {
        this.items = items;
    }
}
