package com.sdkwork.clawrouter.backend.model;


public class PaymentsRouteRulesListResult {
    private String code;
    private CommercePaymentRouteRuleListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentRouteRuleListResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentRouteRuleListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
