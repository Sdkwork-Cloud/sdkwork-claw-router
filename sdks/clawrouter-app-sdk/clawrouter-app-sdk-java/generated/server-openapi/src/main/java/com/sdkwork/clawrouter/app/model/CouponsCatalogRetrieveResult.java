package com.sdkwork.clawrouter.app.model;


public class CouponsCatalogRetrieveResult {
    private String code;
    private CommerceCouponCatalogItem data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceCouponCatalogItem getData() {
        return this.data;
    }

    public void setData(CommerceCouponCatalogItem data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
