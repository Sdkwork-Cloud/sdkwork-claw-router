package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillListResponse {
    private List<AdminSkillItem> items;

    public List<AdminSkillItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminSkillItem> items) {
        this.items = items;
    }
}
