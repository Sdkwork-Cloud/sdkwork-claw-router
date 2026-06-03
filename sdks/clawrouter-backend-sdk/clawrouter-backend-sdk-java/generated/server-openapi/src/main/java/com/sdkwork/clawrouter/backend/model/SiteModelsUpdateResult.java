package com.sdkwork.clawrouter.backend.model;


public class SiteModelsUpdateResult {
    private String code;
    private AdminSiteModelMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminSiteModelMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminSiteModelMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
