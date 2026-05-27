package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillCategoryListResponse {
    private List<AdminSkillCategoryItem> items;

    public List<AdminSkillCategoryItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminSkillCategoryItem> items) {
        this.items = items;
    }
}
