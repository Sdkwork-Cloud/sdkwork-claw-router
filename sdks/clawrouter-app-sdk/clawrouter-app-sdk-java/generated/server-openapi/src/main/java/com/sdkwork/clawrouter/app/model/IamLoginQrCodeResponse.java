package com.sdkwork.clawrouter.app.model;


public class IamLoginQrCodeResponse {
    private String description;
    private Integer expireTime;
    private String qrContent;
    private String qrKey;
    private String qrUrl;
    private String title;
    private String type;

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getExpireTime() {
        return this.expireTime;
    }
    
    public void setExpireTime(Integer expireTime) {
        this.expireTime = expireTime;
    }

    public String getQrContent() {
        return this.qrContent;
    }
    
    public void setQrContent(String qrContent) {
        this.qrContent = qrContent;
    }

    public String getQrKey() {
        return this.qrKey;
    }
    
    public void setQrKey(String qrKey) {
        this.qrKey = qrKey;
    }

    public String getQrUrl() {
        return this.qrUrl;
    }
    
    public void setQrUrl(String qrUrl) {
        this.qrUrl = qrUrl;
    }

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return this.type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
}
