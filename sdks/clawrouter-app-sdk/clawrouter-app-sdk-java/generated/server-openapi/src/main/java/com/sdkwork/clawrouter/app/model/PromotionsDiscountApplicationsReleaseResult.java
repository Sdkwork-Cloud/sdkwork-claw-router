package com.sdkwork.clawrouter.app.model;


public class PromotionsDiscountApplicationsReleaseResult {
    private String code;
    private PromotionOperationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public PromotionOperationResponse getData() {
        return this.data;
    }

    public void setData(PromotionOperationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
