package com.sdkwork.clawrouter.backend.model;


public class CommerceInventoryStockUpdateRequest {
    private Integer availableQuantity;
    private String reasonCode;
    private Integer reservedQuantity;
    private String status;
    private Integer version;

    public Integer getAvailableQuantity() {
        return this.availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getReasonCode() {
        return this.reasonCode;
    }

    public void setReasonCode(String reasonCode) {
        this.reasonCode = reasonCode;
    }

    public Integer getReservedQuantity() {
        return this.reservedQuantity;
    }

    public void setReservedQuantity(Integer reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getVersion() {
        return this.version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }
}
