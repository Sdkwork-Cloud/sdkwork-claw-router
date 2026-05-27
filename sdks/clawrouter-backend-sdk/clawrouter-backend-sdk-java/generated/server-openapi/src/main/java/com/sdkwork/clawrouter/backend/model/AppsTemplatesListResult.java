package com.sdkwork.clawrouter.backend.model;


public class AppsTemplatesListResult {
    private String code;
    private AdminAppTemplateListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppTemplateListResponse getData() {
        return this.data;
    }

    public void setData(AdminAppTemplateListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
