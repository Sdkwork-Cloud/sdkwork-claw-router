package com.sdkwork.clawrouter.backend.model;


public class CatalogProductsCreateResult {
    private String code;
    private CommerceProductSpuMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductSpuMutationResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductSpuMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
