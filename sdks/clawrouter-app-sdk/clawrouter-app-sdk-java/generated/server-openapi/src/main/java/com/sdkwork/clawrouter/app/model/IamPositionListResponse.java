package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class IamPositionListResponse {
    private List<IamPositionItem> items;

    public List<IamPositionItem> getItems() {
        return this.items;
    }

    public void setItems(List<IamPositionItem> items) {
        this.items = items;
    }
}
