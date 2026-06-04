package com.sdkwork.clawrouter.app.model;


public class AppModelCatalogReferencePrice {
    private String billingMeter;
    private String currency;
    private String regionCode;
    private String unitPrice;

    public String getBillingMeter() {
        return this.billingMeter;
    }

    public void setBillingMeter(String billingMeter) {
        this.billingMeter = billingMeter;
    }

    public String getCurrency() {
        return this.currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getRegionCode() {
        return this.regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getUnitPrice() {
        return this.unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }
}
