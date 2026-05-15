package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppApiKeyListResponse {
    private List<AppApiKeyGroup> groups;
    private List<AppApiKeyItem> items;

    public List<AppApiKeyGroup> getGroups() {
        return this.groups;
    }
    
    public void setGroups(List<AppApiKeyGroup> groups) {
        this.groups = groups;
    }

    public List<AppApiKeyItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AppApiKeyItem> items) {
        this.items = items;
    }
}
