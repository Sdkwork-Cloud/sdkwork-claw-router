package com.sdkwork.clawrouter.app.model;


public class CommerceVipPrivilegeUsageItem {
    private String periodKey;
    private String privilegeCode;
    private Integer quotaCount;
    private Integer usedCount;

    public String getPeriodKey() {
        return this.periodKey;
    }
    
    public void setPeriodKey(String periodKey) {
        this.periodKey = periodKey;
    }

    public String getPrivilegeCode() {
        return this.privilegeCode;
    }
    
    public void setPrivilegeCode(String privilegeCode) {
        this.privilegeCode = privilegeCode;
    }

    public Integer getQuotaCount() {
        return this.quotaCount;
    }
    
    public void setQuotaCount(Integer quotaCount) {
        this.quotaCount = quotaCount;
    }

    public Integer getUsedCount() {
        return this.usedCount;
    }
    
    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }
}
