package com.sdkwork.clawrouter.backend.model;


public class AppsTemplatesDeleteResult {
    private String code;
    private AdminAppTemplateDeleteResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminAppTemplateDeleteResponse getData() {
        return this.data;
    }

    public void setData(AdminAppTemplateDeleteResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
