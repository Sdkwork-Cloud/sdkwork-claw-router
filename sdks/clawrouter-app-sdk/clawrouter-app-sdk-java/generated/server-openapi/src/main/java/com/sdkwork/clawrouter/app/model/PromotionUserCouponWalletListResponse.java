package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class PromotionUserCouponWalletListResponse {
    private List<PromotionCouponWalletItem> items;

    public List<PromotionCouponWalletItem> getItems() {
        return this.items;
    }

    public void setItems(List<PromotionCouponWalletItem> items) {
        this.items = items;
    }
}
