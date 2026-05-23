package com.sdkwork.clawrouter.backend.model;


public class CommercePriceListMutationRequest {
    private String currencyCode;
    private String customerSegment;
    private String endsAt;
    private String marketCode;
    private String priceListNo;
    private String startsAt;
    private String status;

    public String getCurrencyCode() {
        return this.currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getCustomerSegment() {
        return this.customerSegment;
    }

    public void setCustomerSegment(String customerSegment) {
        this.customerSegment = customerSegment;
    }

    public String getEndsAt() {
        return this.endsAt;
    }

    public void setEndsAt(String endsAt) {
        this.endsAt = endsAt;
    }

    public String getMarketCode() {
        return this.marketCode;
    }

    public void setMarketCode(String marketCode) {
        this.marketCode = marketCode;
    }

    public String getPriceListNo() {
        return this.priceListNo;
    }

    public void setPriceListNo(String priceListNo) {
        this.priceListNo = priceListNo;
    }

    public String getStartsAt() {
        return this.startsAt;
    }

    public void setStartsAt(String startsAt) {
        this.startsAt = startsAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
