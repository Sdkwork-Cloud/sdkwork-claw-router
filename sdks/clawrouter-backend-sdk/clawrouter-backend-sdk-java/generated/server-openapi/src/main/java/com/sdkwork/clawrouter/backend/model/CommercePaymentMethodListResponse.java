package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentMethodListResponse {
    private List<CommercePaymentMethodItem> items;
    private String page;
    private String pageSize;
    private String total;

    public List<CommercePaymentMethodItem> getItems() {
        return this.items;
    }

    public void setItems(List<CommercePaymentMethodItem> items) {
        this.items = items;
    }

    public String getPage() {
        return this.page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getPageSize() {
        return this.pageSize;
    }

    public void setPageSize(String pageSize) {
        this.pageSize = pageSize;
    }

    public String getTotal() {
        return this.total;
    }

    public void setTotal(String total) {
        this.total = total;
    }
}
