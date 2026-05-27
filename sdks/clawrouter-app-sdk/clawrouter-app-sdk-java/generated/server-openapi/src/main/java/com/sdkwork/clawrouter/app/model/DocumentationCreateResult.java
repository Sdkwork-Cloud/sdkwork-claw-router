package com.sdkwork.clawrouter.app.model;


public class DocumentationCreateResult {
    private String code;
    private SdkReferenceDocumentationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public SdkReferenceDocumentationResponse getData() {
        return this.data;
    }

    public void setData(SdkReferenceDocumentationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
