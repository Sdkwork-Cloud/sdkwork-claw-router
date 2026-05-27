package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAppTemplateListResponse {
    private Boolean hasNextPage;
    private List<AdminAppTemplateItemResponse> items;
    private Integer page;
    private Integer pageSize;
    private Integer total;

    public Boolean getHasNextPage() {
        return this.hasNextPage;
    }

    public void setHasNextPage(Boolean hasNextPage) {
        this.hasNextPage = hasNextPage;
    }

    public List<AdminAppTemplateItemResponse> getItems() {
        return this.items;
    }

    public void setItems(List<AdminAppTemplateItemResponse> items) {
        this.items = items;
    }

    public Integer getPage() {
        return this.page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return this.pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getTotal() {
        return this.total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
