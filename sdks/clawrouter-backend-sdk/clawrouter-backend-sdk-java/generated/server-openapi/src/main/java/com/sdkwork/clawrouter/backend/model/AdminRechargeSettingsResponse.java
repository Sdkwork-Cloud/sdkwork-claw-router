package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AdminRechargeSettingsResponse {
    private String baseCurrencyCode;
    private String basePointsPerCny;
    private Map<String, String> currencyToCnyRates;

    public String getBaseCurrencyCode() {
        return this.baseCurrencyCode;
    }

    public void setBaseCurrencyCode(String baseCurrencyCode) {
        this.baseCurrencyCode = baseCurrencyCode;
    }

    public String getBasePointsPerCny() {
        return this.basePointsPerCny;
    }

    public void setBasePointsPerCny(String basePointsPerCny) {
        this.basePointsPerCny = basePointsPerCny;
    }

    public Map<String, String> getCurrencyToCnyRates() {
        return this.currencyToCnyRates;
    }

    public void setCurrencyToCnyRates(Map<String, String> currencyToCnyRates) {
        this.currencyToCnyRates = currencyToCnyRates;
    }
}
