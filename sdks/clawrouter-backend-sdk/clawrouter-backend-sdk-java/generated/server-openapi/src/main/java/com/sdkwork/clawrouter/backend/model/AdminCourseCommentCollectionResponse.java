package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCourseCommentCollectionResponse {
    private List<AdminCourseCommentItem> items;

    public List<AdminCourseCommentItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminCourseCommentItem> items) {
        this.items = items;
    }
}
