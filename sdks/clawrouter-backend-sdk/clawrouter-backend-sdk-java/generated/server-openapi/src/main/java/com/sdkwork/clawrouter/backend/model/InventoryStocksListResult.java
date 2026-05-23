package com.sdkwork.clawrouter.backend.model;


public class InventoryStocksListResult {
    private String code;
    private CommerceInventoryStockListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceInventoryStockListResponse getData() {
        return this.data;
    }

    public void setData(CommerceInventoryStockListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
