package com.sdkwork.clawrouter.app.model;


public class AppModelCatalogReferencePrice {
    private String billingMeter;
    private String currency;
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

    public String getUnitPrice() {
        return this.unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }
}
