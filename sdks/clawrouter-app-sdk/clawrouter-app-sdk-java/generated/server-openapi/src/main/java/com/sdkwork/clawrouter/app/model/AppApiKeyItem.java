package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppApiKeyItem {
    private String copyableKey;
    private String created;
    private String expires;
    private String group;
    private String id;
    private String ipLimit;
    private String maskedKey;
    private List<String> modalities;
    private String name;
    private String quota;
    private String rate;
    private String status;
    private String usedQuota;

    public String getCopyableKey() {
        return this.copyableKey;
    }
    
    public void setCopyableKey(String copyableKey) {
        this.copyableKey = copyableKey;
    }

    public String getCreated() {
        return this.created;
    }
    
    public void setCreated(String created) {
        this.created = created;
    }

    public String getExpires() {
        return this.expires;
    }
    
    public void setExpires(String expires) {
        this.expires = expires;
    }

    public String getGroup() {
        return this.group;
    }
    
    public void setGroup(String group) {
        this.group = group;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getIpLimit() {
        return this.ipLimit;
    }
    
    public void setIpLimit(String ipLimit) {
        this.ipLimit = ipLimit;
    }

    public String getMaskedKey() {
        return this.maskedKey;
    }
    
    public void setMaskedKey(String maskedKey) {
        this.maskedKey = maskedKey;
    }

    public List<String> getModalities() {
        return this.modalities;
    }
    
    public void setModalities(List<String> modalities) {
        this.modalities = modalities;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getQuota() {
        return this.quota;
    }
    
    public void setQuota(String quota) {
        this.quota = quota;
    }

    public String getRate() {
        return this.rate;
    }
    
    public void setRate(String rate) {
        this.rate = rate;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getUsedQuota() {
        return this.usedQuota;
    }
    
    public void setUsedQuota(String usedQuota) {
        this.usedQuota = usedQuota;
    }
}
