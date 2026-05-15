package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AccountSummaryResponse {
    private Double availableCredits;
    private List<AccountConsumptionItem> consumptionByService;
    private String email;
    private Integer estDaysRemaining;
    private String id;
    private AccountInvoiceSettings invoiceSettings;
    private Boolean isVerified;
    private List<AccountLoginLog> loginLogs;
    private Double monthlyConsumption;
    private String name;
    private String organization;
    private AccountSecuritySummary security;
    private String tier;

    public Double getAvailableCredits() {
        return this.availableCredits;
    }
    
    public void setAvailableCredits(Double availableCredits) {
        this.availableCredits = availableCredits;
    }

    public List<AccountConsumptionItem> getConsumptionByService() {
        return this.consumptionByService;
    }
    
    public void setConsumptionByService(List<AccountConsumptionItem> consumptionByService) {
        this.consumptionByService = consumptionByService;
    }

    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getEstDaysRemaining() {
        return this.estDaysRemaining;
    }
    
    public void setEstDaysRemaining(Integer estDaysRemaining) {
        this.estDaysRemaining = estDaysRemaining;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public AccountInvoiceSettings getInvoiceSettings() {
        return this.invoiceSettings;
    }
    
    public void setInvoiceSettings(AccountInvoiceSettings invoiceSettings) {
        this.invoiceSettings = invoiceSettings;
    }

    public Boolean getIsVerified() {
        return this.isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public List<AccountLoginLog> getLoginLogs() {
        return this.loginLogs;
    }
    
    public void setLoginLogs(List<AccountLoginLog> loginLogs) {
        this.loginLogs = loginLogs;
    }

    public Double getMonthlyConsumption() {
        return this.monthlyConsumption;
    }
    
    public void setMonthlyConsumption(Double monthlyConsumption) {
        this.monthlyConsumption = monthlyConsumption;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getOrganization() {
        return this.organization;
    }
    
    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public AccountSecuritySummary getSecurity() {
        return this.security;
    }
    
    public void setSecurity(AccountSecuritySummary security) {
        this.security = security;
    }

    public String getTier() {
        return this.tier;
    }
    
    public void setTier(String tier) {
        this.tier = tier;
    }
}
