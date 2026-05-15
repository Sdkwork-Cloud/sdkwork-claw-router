package com.sdkwork.clawrouter.app.model;


public class AccountInvoiceSettings {
    private String invoiceType;
    private String orgFull;
    private String paymentMethod;
    private String taxId;

    public String getInvoiceType() {
        return this.invoiceType;
    }
    
    public void setInvoiceType(String invoiceType) {
        this.invoiceType = invoiceType;
    }

    public String getOrgFull() {
        return this.orgFull;
    }
    
    public void setOrgFull(String orgFull) {
        this.orgFull = orgFull;
    }

    public String getPaymentMethod() {
        return this.paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTaxId() {
        return this.taxId;
    }
    
    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }
}
