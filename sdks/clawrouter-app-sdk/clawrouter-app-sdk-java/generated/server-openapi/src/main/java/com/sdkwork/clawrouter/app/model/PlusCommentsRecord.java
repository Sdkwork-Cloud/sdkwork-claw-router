package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class PlusCommentsRecord {
    private Map<String, String> author;
    private String deviceInfo;
    private String ipAddress;
    private String parentId;
    private String path;
    private String userId;

    public Map<String, String> getAuthor() {
        return this.author;
    }

    public void setAuthor(Map<String, String> author) {
        this.author = author;
    }

    public String getDeviceInfo() {
        return this.deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getIpAddress() {
        return this.ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getParentId() {
        return this.parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
