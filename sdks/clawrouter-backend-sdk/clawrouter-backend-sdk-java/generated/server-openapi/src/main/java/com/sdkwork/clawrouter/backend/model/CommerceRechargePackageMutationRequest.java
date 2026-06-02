package com.sdkwork.clawrouter.backend.model;


public class CommerceRechargePackageMutationRequest {
    private Integer bonusPoints;
    private String currencyCode;
    private String priceAmount;
    private String status;

    public Integer getBonusPoints() {
        return this.bonusPoints;
    }

    public void setBonusPoints(Integer bonusPoints) {
        this.bonusPoints = bonusPoints;
    }

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getPriceAmount() {
        return this.priceAmount;
    }

    public void setPriceAmount(String priceAmount) {
        this.priceAmount = priceAmount;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
