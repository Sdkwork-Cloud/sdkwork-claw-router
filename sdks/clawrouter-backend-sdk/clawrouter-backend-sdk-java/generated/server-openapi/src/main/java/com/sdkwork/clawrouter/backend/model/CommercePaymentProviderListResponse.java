package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentProviderListResponse {
    private List<CommercePaymentProviderItem> items;
    private Integer page;
    private Integer pageSize;
    private Integer total;

    public List<CommercePaymentProviderItem> getItems() {
        return this.items;
    }

    public void setItems(List<CommercePaymentProviderItem> items) {
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
