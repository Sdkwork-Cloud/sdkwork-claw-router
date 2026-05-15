package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppInstalledSkillsResponse {
    private List<AppInstalledSkillItem> items;

    public List<AppInstalledSkillItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AppInstalledSkillItem> items) {
        this.items = items;
    }
}
