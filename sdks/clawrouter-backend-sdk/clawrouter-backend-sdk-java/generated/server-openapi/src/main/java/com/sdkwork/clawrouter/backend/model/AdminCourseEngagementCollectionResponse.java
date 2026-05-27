package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCourseEngagementCollectionResponse {
    private List<AdminCourseEngagementItem> items;

    public List<AdminCourseEngagementItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminCourseEngagementItem> items) {
        this.items = items;
    }
}
