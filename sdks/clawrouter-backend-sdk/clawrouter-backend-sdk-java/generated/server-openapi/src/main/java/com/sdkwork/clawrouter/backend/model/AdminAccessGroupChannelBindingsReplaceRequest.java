package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAccessGroupChannelBindingsReplaceRequest {
    private List<AdminAccessGroupChannelBindingInput> items;

    public List<AdminAccessGroupChannelBindingInput> getItems() {
        return this.items;
    }

    public void setItems(List<AdminAccessGroupChannelBindingInput> items) {
        this.items = items;
    }
}
