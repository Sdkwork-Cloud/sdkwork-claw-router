package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillAssetListResponse {
    private List<AdminSkillAssetItem> items;

    public List<AdminSkillAssetItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminSkillAssetItem> items) {
        this.items = items;
    }
}
