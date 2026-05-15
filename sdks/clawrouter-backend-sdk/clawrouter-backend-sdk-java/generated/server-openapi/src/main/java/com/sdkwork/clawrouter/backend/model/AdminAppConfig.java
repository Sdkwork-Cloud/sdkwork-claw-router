package com.sdkwork.clawrouter.backend.model;


public class AdminAppConfig {
    private AdminAppPortalConfig portal;
    private AdminAppConfigStandard standard;

    public AdminAppPortalConfig getPortal() {
        return this.portal;
    }
    
    public void setPortal(AdminAppPortalConfig portal) {
        this.portal = portal;
    }

    public AdminAppConfigStandard getStandard() {
        return this.standard;
    }
    
    public void setStandard(AdminAppConfigStandard standard) {
        this.standard = standard;
    }
}
