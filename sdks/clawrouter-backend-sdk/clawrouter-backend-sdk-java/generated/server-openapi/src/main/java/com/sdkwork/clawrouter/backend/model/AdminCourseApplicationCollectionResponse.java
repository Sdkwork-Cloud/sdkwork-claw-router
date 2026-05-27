package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCourseApplicationCollectionResponse {
    private List<AdminCourseApplicationItem> items;

    public List<AdminCourseApplicationItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminCourseApplicationItem> items) {
        this.items = items;
    }
}
