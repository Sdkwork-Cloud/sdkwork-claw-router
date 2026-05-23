package com.sdkwork.clawrouter.backend.model;


public class InventoryStocksUpdateResult {
    private String code;
    private CommerceInventoryStockMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceInventoryStockMutationResponse getData() {
        return this.data;
    }

    public void setData(CommerceInventoryStockMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
