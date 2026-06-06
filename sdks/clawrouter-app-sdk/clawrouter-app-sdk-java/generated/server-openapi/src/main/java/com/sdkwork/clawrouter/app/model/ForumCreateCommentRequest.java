package com.sdkwork.clawrouter.app.model;


public class ForumCreateCommentRequest {
    private String content;
    private String contentId;
    private String contentType;
    private String deviceInfo;

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentId() {
        return this.contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getContentType() {
        return this.contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getDeviceInfo() {
        return this.deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }
}
