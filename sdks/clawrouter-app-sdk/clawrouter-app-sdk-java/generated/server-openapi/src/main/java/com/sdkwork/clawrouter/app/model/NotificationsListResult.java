package com.sdkwork.clawrouter.app.model;


public class NotificationsListResult {
    private String code;
    private NotificationsResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public NotificationsResponse getData() {
        return this.data;
    }

    public void setData(NotificationsResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
