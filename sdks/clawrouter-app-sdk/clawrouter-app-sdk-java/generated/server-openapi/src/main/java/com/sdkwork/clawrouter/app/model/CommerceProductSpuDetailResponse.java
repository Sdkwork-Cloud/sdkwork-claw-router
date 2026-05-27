package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CommerceProductSpuDetailResponse {
    private CommerceProductSpuItem item;
    private List<CommerceProductSkuItem> skus;

    public CommerceProductSpuItem getItem() {
        return this.item;
    }

    public void setItem(CommerceProductSpuItem item) {
        this.item = item;
    }

    public List<CommerceProductSkuItem> getSkus() {
        return this.skus;
    }

    public void setSkus(List<CommerceProductSkuItem> skus) {
        this.skus = skus;
    }
}
