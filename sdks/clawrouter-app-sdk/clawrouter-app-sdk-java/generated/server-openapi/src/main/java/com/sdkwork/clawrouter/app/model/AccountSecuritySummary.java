package com.sdkwork.clawrouter.app.model;


public class AccountSecuritySummary {
    private Integer ipWhitelistCount;
    private Boolean mfaEnabled;
    private Integer qpsLimit;

    public Integer getIpWhitelistCount() {
        return this.ipWhitelistCount;
    }
    
    public void setIpWhitelistCount(Integer ipWhitelistCount) {
        this.ipWhitelistCount = ipWhitelistCount;
    }

    public Boolean getMfaEnabled() {
        return this.mfaEnabled;
    }
    
    public void setMfaEnabled(Boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public Integer getQpsLimit() {
        return this.qpsLimit;
    }
    
    public void setQpsLimit(Integer qpsLimit) {
        this.qpsLimit = qpsLimit;
    }
}
