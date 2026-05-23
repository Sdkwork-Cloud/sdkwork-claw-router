package com.sdkwork.clawrouter.backend.model;


public class RechargesPackagesUpdateResult {
    private String code;
    private AdminRechargePackageMutationResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminRechargePackageMutationResponse getData() {
        return this.data;
    }

    public void setData(AdminRechargePackageMutationResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
