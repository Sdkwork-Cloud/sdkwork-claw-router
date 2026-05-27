package com.sdkwork.clawrouter.app.model;


public class SdkReferenceDocumentationResponse {
    private Boolean generated;
    private String language;
    private String methodDefinition;
    private String readme;
    private String usageExample;

    public Boolean getGenerated() {
        return this.generated;
    }

    public void setGenerated(Boolean generated) {
        this.generated = generated;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getMethodDefinition() {
        return this.methodDefinition;
    }

    public void setMethodDefinition(String methodDefinition) {
        this.methodDefinition = methodDefinition;
    }

    public String getReadme() {
        return this.readme;
    }

    public void setReadme(String readme) {
        this.readme = readme;
    }

    public String getUsageExample() {
        return this.usageExample;
    }

    public void setUsageExample(String usageExample) {
        this.usageExample = usageExample;
    }
}
