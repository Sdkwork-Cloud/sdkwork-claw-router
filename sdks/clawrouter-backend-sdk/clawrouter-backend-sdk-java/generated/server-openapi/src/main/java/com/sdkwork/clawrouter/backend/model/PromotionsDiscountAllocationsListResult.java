package com.sdkwork.clawrouter.backend.model;


public class PromotionsDiscountAllocationsListResult {
    private String code;
    private PromotionCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public PromotionCollectionResponse getData() {
        return this.data;
    }

    public void setData(PromotionCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
