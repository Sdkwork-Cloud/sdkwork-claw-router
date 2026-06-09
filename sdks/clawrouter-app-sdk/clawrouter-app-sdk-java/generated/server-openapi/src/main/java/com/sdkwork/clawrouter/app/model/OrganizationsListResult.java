package com.sdkwork.clawrouter.app.model;


public class OrganizationsListResult {
    private String code;
    private IamOrganizationListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamOrganizationListResponse getData() {
        return this.data;
    }

    public void setData(IamOrganizationListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
