package com.sdkwork.clawrouter.backend.model;


public class CouponBatchesListResult {
    private String code;
    private AdminCouponBatchesResponse data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public AdminCouponBatchesResponse getData() {
        return this.data;
    }
    
    public void setData(AdminCouponBatchesResponse data) {
        this.data = data;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public String getMsg() {
        return this.msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
}
