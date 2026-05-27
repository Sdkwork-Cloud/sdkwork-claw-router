package com.sdkwork.clawrouter.backend.model;

import java.util.List;
import java.util.Map;

public class AdminCourseRelationsReplaceRequest {
    private List<Map<String, Object>> items;

    public List<Map<String, Object>> getItems() {
        return this.items;
    }

    public void setItems(List<Map<String, Object>> items) {
        this.items = items;
    }
}
