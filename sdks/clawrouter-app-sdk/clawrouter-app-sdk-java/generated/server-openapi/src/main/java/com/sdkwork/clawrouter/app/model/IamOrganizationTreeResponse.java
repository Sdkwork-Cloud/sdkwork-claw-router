package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamOrganizationTreeResponse {
    private List<IamOrganizationTreeItem> items;

    public List<IamOrganizationTreeItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamOrganizationTreeItem> items) {
        this.items = items;
    }
}
