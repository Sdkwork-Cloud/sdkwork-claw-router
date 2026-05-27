package com.sdkwork.clawrouter.app.model;


public class PromotionsUserCouponsWalletListResult {
    private String code;
    private PromotionUserCouponWalletListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public PromotionUserCouponWalletListResponse getData() {
        return this.data;
    }

    public void setData(PromotionUserCouponWalletListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
