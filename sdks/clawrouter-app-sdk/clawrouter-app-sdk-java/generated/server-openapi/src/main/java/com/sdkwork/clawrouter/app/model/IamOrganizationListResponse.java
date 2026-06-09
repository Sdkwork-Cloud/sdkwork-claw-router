package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamOrganizationListResponse {
    private List<IamOrganizationItem> items;

    public List<IamOrganizationItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamOrganizationItem> items) {
        this.items = items;
    }
}
