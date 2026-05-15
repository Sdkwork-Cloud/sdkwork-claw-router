package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumCommentPage {
    private List<ForumCommentItem> content;
    private List<ForumCommentItem> items;
    private Integer page;
    private Integer size;
    private Integer totalElements;

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
