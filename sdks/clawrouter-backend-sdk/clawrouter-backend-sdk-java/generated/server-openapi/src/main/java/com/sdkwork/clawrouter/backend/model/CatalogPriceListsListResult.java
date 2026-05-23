package com.sdkwork.clawrouter.backend.model;


public class CatalogPriceListsListResult {
    private String code;
    private CommercePriceListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePriceListResponse getData() {
        return this.data;
    }

    public void setData(CommercePriceListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
