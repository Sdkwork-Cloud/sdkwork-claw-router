package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCacheKeyListResponse {
    private Boolean hasMore;
    private String instanceName;
    private List<AdminCacheKeyItem> items;
    private Integer limit;
    private String namespace;
    private String nextCursor;
    private Integer returnedItems;
    private Boolean scanComplete;
    private Integer scannedItems;

    public Boolean getHasMore() {
        return this.hasMore;
    }

    public void setHasMore(Boolean hasMore) {
        this.hasMore = hasMore;
    }

    public String getInstanceName() {
        return this.instanceName;
    }

    public void setInstanceName(String instanceName) {
        this.instanceName = instanceName;
    }

    public List<AdminCacheKeyItem> getItems() {
        return this.items;
    }

    public void setItems(List<AdminCacheKeyItem> items) {
        this.items = items;
    }

    public Integer getLimit() {
        return this.limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public String getNamespace() {
        return this.namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getNextCursor() {
        return this.nextCursor;
    }

    public void setNextCursor(String nextCursor) {
        this.nextCursor = nextCursor;
    }

    public Integer getReturnedItems() {
        return this.returnedItems;
    }

    public void setReturnedItems(Integer returnedItems) {
        this.returnedItems = returnedItems;
    }

    public Boolean getScanComplete() {
        return this.scanComplete;
    }

    public void setScanComplete(Boolean scanComplete) {
        this.scanComplete = scanComplete;
    }

    public Integer getScannedItems() {
        return this.scannedItems;
    }

    public void setScannedItems(Integer scannedItems) {
        this.scannedItems = scannedItems;
    }
}
