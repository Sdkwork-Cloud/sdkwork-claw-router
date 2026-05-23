package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class OpenPlatformManifestListResponse {
    private List<OpenPlatformManifestItem> items;

    public List<OpenPlatformManifestItem> getItems() {
        return this.items;
    }

    public void setItems(List<OpenPlatformManifestItem> items) {
        this.items = items;
    }
}
