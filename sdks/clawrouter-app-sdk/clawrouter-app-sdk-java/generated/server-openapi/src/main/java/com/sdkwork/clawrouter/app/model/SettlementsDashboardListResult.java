package com.sdkwork.clawrouter.app.model;


public class SettlementsDashboardListResult {
    private String code;
    private SettlementDashboardResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public SettlementDashboardResponse getData() {
        return this.data;
    }

    public void setData(SettlementDashboardResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
