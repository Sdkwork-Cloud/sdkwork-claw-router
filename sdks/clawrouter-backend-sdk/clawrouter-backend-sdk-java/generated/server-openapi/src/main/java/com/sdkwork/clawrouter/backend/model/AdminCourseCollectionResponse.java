package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCourseCollectionResponse {
    private List<AdminCourseItem> items;

    public List<AdminCourseItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminCourseItem> items) {
        this.items = items;
    }
}
