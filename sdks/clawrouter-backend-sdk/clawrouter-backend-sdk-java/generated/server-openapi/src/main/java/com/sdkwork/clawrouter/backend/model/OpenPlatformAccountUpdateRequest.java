package com.sdkwork.clawrouter.backend.model;


public class OpenPlatformAccountUpdateRequest {
    private String appId;
    private String appSecret;
    private String defaultEntryId;
    private String encodingAesKey;
    private String name;
    private Boolean qrDefault;
    private String status;
    private String token;

    public String getAppId() {
        return this.appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppSecret() {
        return this.appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public String getDefaultEntryId() {
        return this.defaultEntryId;
    }

    public void setDefaultEntryId(String defaultEntryId) {
        this.defaultEntryId = defaultEntryId;
    }

    public String getEncodingAesKey() {
        return this.encodingAesKey;
    }

    public void setEncodingAesKey(String encodingAesKey) {
        this.encodingAesKey = encodingAesKey;
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

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
