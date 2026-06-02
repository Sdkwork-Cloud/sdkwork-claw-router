package com.sdkwork.clawrouter.backend.model;


public class PaymentsRuntimeSnapshotRetrieveResult {
    private String code;
    private CommercePaymentRuntimeSnapshotResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommercePaymentRuntimeSnapshotResponse getData() {
        return this.data;
    }

    public void setData(CommercePaymentRuntimeSnapshotResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
