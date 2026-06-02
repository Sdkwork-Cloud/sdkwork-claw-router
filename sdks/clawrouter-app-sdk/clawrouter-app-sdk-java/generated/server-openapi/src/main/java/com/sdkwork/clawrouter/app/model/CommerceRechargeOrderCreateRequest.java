package com.sdkwork.clawrouter.app.model;


public class CommerceRechargeOrderCreateRequest {
    private String amount;
    private String clientRequestNo;
    private String currencyCode;
    private String packageId;
    private String source;

    public String getAmount() {
        return this.amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getClientRequestNo() {
        return this.clientRequestNo;
    }

    public void setClientRequestNo(String clientRequestNo) {
        this.clientRequestNo = clientRequestNo;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getPackageId() {
        return this.packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
