package com.sdkwork.clawrouter.backend.model;


public class AdminPromoCodeItem {
    private String batchId;
    private String code;
    private String id;
    private String status;
    private String usedAt;
    private String usedBy;

    public String getBatchId() {
        return this.batchId;
    }
    
    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getUsedAt() {
        return this.usedAt;
    }
    
    public void setUsedAt(String usedAt) {
        this.usedAt = usedAt;
    }

    public String getUsedBy() {
        return this.usedBy;
    }
    
    public void setUsedBy(String usedBy) {
        this.usedBy = usedBy;
    }
}
