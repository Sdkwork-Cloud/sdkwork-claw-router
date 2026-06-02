package com.sdkwork.clawrouter.backend.model;


public class RechargesPackagesListResult {
    private String code;
    private AdminRechargePackageListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminRechargePackageListResponse getData() {
        return this.data;
    }

    public void setData(AdminRechargePackageListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
