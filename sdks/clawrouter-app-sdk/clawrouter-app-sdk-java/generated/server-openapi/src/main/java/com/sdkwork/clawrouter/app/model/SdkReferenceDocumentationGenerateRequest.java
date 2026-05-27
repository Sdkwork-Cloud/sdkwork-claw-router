package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class SdkReferenceDocumentationGenerateRequest {
    private Map<String, Object> config;
    private String language;
    private Map<String, String> spec;

    public Map<String, Object> getConfig() {
        return this.config;
    }

    public void setConfig(Map<String, Object> config) {
        this.config = config;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Map<String, String> getSpec() {
        return this.spec;
    }

    public void setSpec(Map<String, String> spec) {
        this.spec = spec;
    }
}
