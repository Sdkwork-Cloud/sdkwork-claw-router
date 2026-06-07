package com.sdkwork.clawrouter.backend.model;


public class InventoryReservationsListResult {
    private String code;
    private CommerceInventoryReservationListResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceInventoryReservationListResponse getData() {
        return this.data;
    }

    public void setData(CommerceInventoryReservationListResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
