package com.sdkwork.clawrouter.backend.model;


public class AppsTemplatesUpdateResult {
    private String code;
    private AdminAppTemplateMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppTemplateMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminAppTemplateMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
