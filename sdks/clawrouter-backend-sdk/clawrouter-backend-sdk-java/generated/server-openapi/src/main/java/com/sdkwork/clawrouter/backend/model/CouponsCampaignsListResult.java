package com.sdkwork.clawrouter.backend.model;


public class CouponsCampaignsListResult {
    private String code;
    private CommerceStandardCollectionResponse data;
    private String msg;

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CommerceStandardCollectionResponse getData() {
        return this.data;
    }

    public void setData(CommerceStandardCollectionResponse data) {
        this.data = data;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
