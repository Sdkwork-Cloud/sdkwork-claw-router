package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamOrganizationMembershipListResponse {
    private List<IamOrganizationMembershipItem> items;

    public List<IamOrganizationMembershipItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamOrganizationMembershipItem> items) {
        this.items = items;
    }
}
