package com.sdkwork.clawrouter.backend.model;


public class CommerceRechargePackageMutationRequest {
    private Integer bonus;
    private String rmb;
    private String status;

    public Integer getBonus() {
        return this.bonus;
    }

    public void setBonus(Integer bonus) {
        this.bonus = bonus;
    }

    public String getRmb() {
        return this.rmb;
    }

    public void setRmb(String rmb) {
        this.rmb = rmb;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
