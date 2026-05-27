package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCourseLessonCollectionResponse {
    private List<AdminCourseLessonItem> items;

    public List<AdminCourseLessonItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminCourseLessonItem> items) {
        this.items = items;
    }
}
