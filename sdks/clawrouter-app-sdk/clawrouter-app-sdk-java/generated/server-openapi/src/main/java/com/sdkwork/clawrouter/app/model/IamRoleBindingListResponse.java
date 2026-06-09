package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamRoleBindingListResponse {
    private List<IamRoleBindingItem> items;

    public List<IamRoleBindingItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamRoleBindingItem> items) {
        this.items = items;
    }
}
