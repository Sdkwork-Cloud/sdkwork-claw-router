package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminPromoCodesResponse {
    private List<AdminPromoCodeItem> items;

    public List<AdminPromoCodeItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminPromoCodeItem> items) {
        this.items = items;
    }
}
