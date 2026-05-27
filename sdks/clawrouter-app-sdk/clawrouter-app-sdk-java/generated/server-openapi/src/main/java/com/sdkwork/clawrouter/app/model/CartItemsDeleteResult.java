package com.sdkwork.clawrouter.app.model;


public class CartItemsDeleteResult {
    private String code;
    private CommerceOperationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceOperationResponse getData() {
        return this.data;
    }

    public void setData(CommerceOperationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
