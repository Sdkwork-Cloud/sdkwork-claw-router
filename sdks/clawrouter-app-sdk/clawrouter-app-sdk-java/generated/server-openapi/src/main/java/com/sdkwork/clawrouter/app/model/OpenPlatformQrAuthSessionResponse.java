package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class OpenPlatformQrAuthSessionResponse {
    private String completedAt;
    private String createdAt;
    private String defaultAccountId;
    private String defaultAccountType;
    private String defaultEntryId;
    private String defaultProvider;
    private String expiresAt;
    private String fallbackUrl;
    private String id;
    private String purpose;
    private Map<String, Object> qrContent;
    private String scannedAt;
    private IamSessionResponse session;
    private String sessionKey;
    private String status;
    private IamSessionResponse token;
    private String updatedAt;
    private IamUserResponse userInfo;

    public String getCompletedAt() {
        return this.completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDefaultAccountId() {
        return this.defaultAccountId;
    }

    public void setDefaultAccountId(String defaultAccountId) {
        this.defaultAccountId = defaultAccountId;
    }

    public String getDefaultAccountType() {
        return this.defaultAccountType;
    }

    public void setDefaultAccountType(String defaultAccountType) {
        this.defaultAccountType = defaultAccountType;
    }

    public String getDefaultEntryId() {
        return this.defaultEntryId;
    }

    public void setDefaultEntryId(String defaultEntryId) {
        this.defaultEntryId = defaultEntryId;
    }

    public String getDefaultProvider() {
        return this.defaultProvider;
    }

    public void setDefaultProvider(String defaultProvider) {
        this.defaultProvider = defaultProvider;
    }

    public String getExpiresAt() {
        return this.expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getFallbackUrl() {
        return this.fallbackUrl;
    }

    public void setFallbackUrl(String fallbackUrl) {
        this.fallbackUrl = fallbackUrl;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPurpose() {
        return this.purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public Map<String, Object> getQrContent() {
        return this.qrContent;
    }

    public void setQrContent(Map<String, Object> qrContent) {
        this.qrContent = qrContent;
    }

    public String getScannedAt() {
        return this.scannedAt;
    }

    public void setScannedAt(String scannedAt) {
        this.scannedAt = scannedAt;
    }

    public IamSessionResponse getSession() {
        return this.session;
    }

    public void setSession(IamSessionResponse session) {
        this.session = session;
    }

    public String getSessionKey() {
        return this.sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public IamSessionResponse getToken() {
        return this.token;
    }

    public void setToken(IamSessionResponse token) {
        this.token = token;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public IamUserResponse getUserInfo() {
        return this.userInfo;
    }

    public void setUserInfo(IamUserResponse userInfo) {
        this.userInfo = userInfo;
    }
}
