package com.sdkwork.clawrouter.backend.model;


public class RechargesSettingsUpdateResult {
    private String code;
    private AdminRechargeSettingsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public AdminRechargeSettingsResponse getData() {
        return this.data;
    }

    public void setData(AdminRechargeSettingsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
