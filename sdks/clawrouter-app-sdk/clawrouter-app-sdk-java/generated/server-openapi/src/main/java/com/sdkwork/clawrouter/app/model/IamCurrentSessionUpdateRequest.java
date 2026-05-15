package com.sdkwork.clawrouter.app.model;


public class IamCurrentSessionUpdateRequest {
    private String deviceName;
    private String organizationCode;
    private String organizationId;

    public String getDeviceName() {
        return this.deviceName;
    }
    
    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getOrganizationCode() {
        return this.organizationCode;
    }
    
    public void setOrganizationCode(String organizationCode) {
        this.organizationCode = organizationCode;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }
    
    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }
}
