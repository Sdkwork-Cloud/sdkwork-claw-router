package com.sdkwork.clawrouter.app.model;


public class OrganizationMembershipsListResult {
    private String code;
    private IamOrganizationMembershipListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public IamOrganizationMembershipListResponse getData() {
        return this.data;
    }

    public void setData(IamOrganizationMembershipListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
