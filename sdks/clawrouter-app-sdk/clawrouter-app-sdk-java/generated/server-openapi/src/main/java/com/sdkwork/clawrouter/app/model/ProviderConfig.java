package com.sdkwork.clawrouter.app.model;


public class ProviderConfig {
    private String description;
    private String id;
    private String integrationType;
    private String name;
    private String providerFamily;
    private String status;
    private String url;

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getIntegrationType() {
        return this.integrationType;
    }
    
    public void setIntegrationType(String integrationType) {
        this.integrationType = integrationType;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getProviderFamily() {
        return this.providerFamily;
    }
    
    public void setProviderFamily(String providerFamily) {
        this.providerFamily = providerFamily;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getUrl() {
        return this.url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
}
