package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class CreateRoutingChannelRequest {
    private String accessType;
    private String baseUrl;
    private List<String> capabilities;
    private List<String> models;
    private String name;
    private String protocol;
    private String secretRef;
    private String status;
    private String vendor;
    private Integer weight;

    public String getAccessType() {
        return this.accessType;
    }
    
    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public String getBaseUrl() {
        return this.baseUrl;
    }
    
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public List<String> getCapabilities() {
        return this.capabilities;
    }
    
    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public List<String> getModels() {
        return this.models;
    }
    
    public void setModels(List<String> models) {
        this.models = models;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getProtocol() {
        return this.protocol;
    }
    
    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getSecretRef() {
        return this.secretRef;
    }
    
    public void setSecretRef(String secretRef) {
        this.secretRef = secretRef;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getVendor() {
        return this.vendor;
    }
    
    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public Integer getWeight() {
        return this.weight;
    }
    
    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
