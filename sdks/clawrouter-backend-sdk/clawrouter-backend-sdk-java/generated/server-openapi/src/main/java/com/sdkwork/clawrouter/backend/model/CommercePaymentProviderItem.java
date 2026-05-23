package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentProviderItem {
    private List<String> capabilities;
    private String createdAt;
    private String displayName;
    private String id;
    private String providerCode;
    private String providerType;
    private String settlementType;
    private String status;
    private List<String> supportedCountries;
    private List<String> supportedCurrencies;
    private String updatedAt;

    public List<String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
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

    public String getProviderType() {
        return this.providerType;
    }

    public void setProviderType(String providerType) {
        this.providerType = providerType;
    }

    public String getSettlementType() {
        return this.settlementType;
    }

    public void setSettlementType(String settlementType) {
        this.settlementType = settlementType;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getSupportedCountries() {
        return this.supportedCountries;
    }

    public void setSupportedCountries(List<String> supportedCountries) {
        this.supportedCountries = supportedCountries;
    }

    public List<String> getSupportedCurrencies() {
        return this.supportedCurrencies;
    }

    public void setSupportedCurrencies(List<String> supportedCurrencies) {
        this.supportedCurrencies = supportedCurrencies;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
