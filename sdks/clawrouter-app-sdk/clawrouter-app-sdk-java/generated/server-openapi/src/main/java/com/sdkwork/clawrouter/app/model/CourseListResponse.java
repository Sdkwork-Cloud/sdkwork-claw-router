package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CourseListResponse {
    private List<CourseItem> content;
    private List<CourseItem> items;
    private Integer page;
    private Integer size;
    private Integer totalElements;

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

    public Integer getPage() {
        return this.page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return this.size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getTotalElements() {
        return this.totalElements;
    }

    public void setTotalElements(Integer totalElements) {
        this.totalElements = totalElements;
    }
}
