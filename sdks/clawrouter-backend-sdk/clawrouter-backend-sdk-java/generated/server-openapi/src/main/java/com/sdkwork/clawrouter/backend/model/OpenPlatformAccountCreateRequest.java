package com.sdkwork.clawrouter.backend.model;


public class OpenPlatformAccountCreateRequest {
    private String aesKeyRef;
    private String appId;
    private String key;
    private String name;
    private String provider;
    private String secretRef;
    private String tokenRef;
    private String type;

    public String getAesKeyRef() {
        return this.aesKeyRef;
    }

    public void setAesKeyRef(String aesKeyRef) {
        this.aesKeyRef = aesKeyRef;
    }

    public String getAppId() {
        return this.appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getKey() {
        return this.key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProvider() {
        return this.provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getSecretRef() {
        return this.secretRef;
    }

    public void setSecretRef(String secretRef) {
        this.secretRef = secretRef;
    }

    public String getTokenRef() {
        return this.tokenRef;
    }

    public void setTokenRef(String tokenRef) {
        this.tokenRef = tokenRef;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
