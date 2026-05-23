package com.sdkwork.clawrouter.backend.model;


public class CommercePaymentReconciliationRunItem {
    private String businessDate;
    private String createdAt;
    private String finishedAt;
    private String id;
    private String providerCode;
    private String runNo;
    private String status;

    public String getBusinessDate() {
        return this.businessDate;
    }

    public void setBusinessDate(String businessDate) {
        this.businessDate = businessDate;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFinishedAt() {
        return this.finishedAt;
    }

    public void setFinishedAt(String finishedAt) {
        this.finishedAt = finishedAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProviderCode() {
        return this.providerCode;
    }

    public void setProviderCode(String providerCode) {
        this.providerCode = providerCode;
    }

    public String getRunNo() {
        return this.runNo;
    }

    public void setRunNo(String runNo) {
        this.runNo = runNo;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
