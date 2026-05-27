package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillPackageListResponse {
    private List<AdminSkillPackageItem> items;

    public List<AdminSkillPackageItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminSkillPackageItem> items) {
        this.items = items;
    }
}
