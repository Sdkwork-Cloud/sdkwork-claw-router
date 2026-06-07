package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminRechargePackageListResponse {
    private List<AdminRechargePackageItem> items;

    public List<AdminRechargePackageItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminRechargePackageItem> items) {
        this.items = items;
    }
}
