package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminUsersResponse {
    private List<AdminUserItem> items;

    public List<AdminUserItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminUserItem> items) {
        this.items = items;
    }
}
