package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentWebhookEventListResponse {
    private List<CommercePaymentWebhookEventItem> items;
    private String page;
    private String pageSize;
    private String total;

    public List<CommercePaymentWebhookEventItem> getItems() {
        return this.items;
    }

    public void setItems(List<CommercePaymentWebhookEventItem> items) {
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
