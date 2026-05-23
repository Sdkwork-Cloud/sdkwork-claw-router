package com.sdkwork.clawrouter.backend.model;


public class CatalogAttributesCreateResult {
    private String code;
    private CommerceProductAttributeMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceProductAttributeMutationResponse getData() {
        return this.data;
    }

    public void setData(CommerceProductAttributeMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
