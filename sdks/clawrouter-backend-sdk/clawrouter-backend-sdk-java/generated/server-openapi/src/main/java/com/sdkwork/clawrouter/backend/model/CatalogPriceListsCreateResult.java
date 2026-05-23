package com.sdkwork.clawrouter.backend.model;


public class CatalogPriceListsCreateResult {
    private String code;
    private CommercePriceListMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePriceListMutationResponse getData() {
        return this.data;
    }

    public void setData(CommercePriceListMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
