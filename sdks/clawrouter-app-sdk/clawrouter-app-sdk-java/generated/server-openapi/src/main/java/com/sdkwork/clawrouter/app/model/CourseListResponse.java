package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CourseListResponse {
    private List<CourseItem> content;
    private List<CourseItem> items;
    private String page;
    private String size;
    private String totalElements;

    public List<CourseItem> getContent() {
        return this.content;
    }

    public void setContent(List<CourseItem> content) {
        this.content = content;
    }

    public List<CourseItem> getItems() {
        return this.items;
    }

    public void setItems(List<CourseItem> items) {
        this.items = items;
    }

    public String getPage() {
        return this.page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getSize() {
        return this.size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getTotalElements() {
        return this.totalElements;
    }

    public void setTotalElements(String totalElements) {
        this.totalElements = totalElements;
    }
}
