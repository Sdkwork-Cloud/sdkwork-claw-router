package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppCatalogResponse {
    private Boolean hasNextPage;
    private List<AppCatalogItem> items;
    private Integer page;
    private Integer pageSize;
    private String total;

    public Boolean getHasNextPage() {
        return this.hasNextPage;
    }

    public void setHasNextPage(Boolean hasNextPage) {
        this.hasNextPage = hasNextPage;
    }

    public List<AppCatalogItem> getItems() {
        return this.items;
    }

    public void setItems(List<AppCatalogItem> items) {
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

    public String getTotal() {
        return this.total;
    }

    public void setTotal(String total) {
        this.total = total;
    }
}
