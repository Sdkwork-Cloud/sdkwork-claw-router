package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminSkillArtifactListResponse {
    private List<AdminSkillArtifactItem> items;

    public List<AdminSkillArtifactItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminSkillArtifactItem> items) {
        this.items = items;
    }
}
