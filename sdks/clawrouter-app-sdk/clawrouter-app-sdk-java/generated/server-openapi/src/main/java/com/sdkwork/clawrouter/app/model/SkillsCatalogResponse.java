package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class SkillsCatalogResponse {
    private List<SkillCatalogItem> items;

    public List<SkillCatalogItem> getItems() {
        return this.items;
    }

    public void setItems(List<SkillCatalogItem> items) {
        this.items = items;
    }
}
