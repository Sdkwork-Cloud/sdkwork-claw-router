package com.sdkwork.clawrouter.backend.model;


public class OpenPlatformAccountUpdateRequest {
    private String aesKeyRef;
    private String appId;
    private String defaultEntryId;
    private String name;
    private Boolean qrDefault;
    private String secretRef;
    private String status;
    private String tokenRef;

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

    public String getDefaultEntryId() {
        return this.defaultEntryId;
    }

    public void setDefaultEntryId(String defaultEntryId) {
        this.defaultEntryId = defaultEntryId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getQrDefault() {
        return this.qrDefault;
    }

    public void setQrDefault(Boolean qrDefault) {
        this.qrDefault = qrDefault;
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

    public String getTokenRef() {
        return this.tokenRef;
    }

    public void setTokenRef(String tokenRef) {
        this.tokenRef = tokenRef;
    }
}
