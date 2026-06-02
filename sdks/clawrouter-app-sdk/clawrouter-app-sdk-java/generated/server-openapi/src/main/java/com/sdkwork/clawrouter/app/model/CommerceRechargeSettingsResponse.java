package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class CommerceRechargeSettingsResponse {
    private String baseCurrencyCode;
    private String basePointsPerCny;
    private Map<String, String> currencyToCnyRates;
    private Map<String, Map<String, Map<String, Object>>> previewExamples;

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

    public Map<String, Map<String, Map<String, Object>>> getPreviewExamples() {
        return this.previewExamples;
    }

    public void setPreviewExamples(Map<String, Map<String, Map<String, Object>>> previewExamples) {
        this.previewExamples = previewExamples;
    }
}
