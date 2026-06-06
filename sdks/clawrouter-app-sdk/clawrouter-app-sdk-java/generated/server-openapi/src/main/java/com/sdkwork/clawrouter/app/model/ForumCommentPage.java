package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumCommentPage {
    private List<ForumCommentItem> content;
    private List<ForumCommentItem> items;
    private String page;
    private String size;
    private String totalElements;

    public List<ForumCommentItem> getContent() {
        return this.content;
    }

    public void setContent(List<ForumCommentItem> content) {
        this.content = content;
    }

    public List<ForumCommentItem> getItems() {
        return this.items;
    }

    public void setItems(List<ForumCommentItem> items) {
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
