package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminCouponBatchGenerateResponse {
    private AdminCouponBatchItem batch;
    private List<AdminPromoCodeItem> codes;

    public AdminCouponBatchItem getBatch() {
        return this.batch;
    }
    
    public void setBatch(AdminCouponBatchItem batch) {
        this.batch = batch;
    }

    public List<AdminPromoCodeItem> getCodes() {
        return this.codes;
    }
    
    public void setCodes(List<AdminPromoCodeItem> codes) {
        this.codes = codes;
    }
}
