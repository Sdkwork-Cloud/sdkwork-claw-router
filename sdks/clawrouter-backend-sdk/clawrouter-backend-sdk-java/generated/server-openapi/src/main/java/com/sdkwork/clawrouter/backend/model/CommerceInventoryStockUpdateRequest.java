package com.sdkwork.clawrouter.backend.model;


public class CommerceInventoryStockUpdateRequest {
    private String availableQuantity;
    private String reasonCode;
    private String reservedQuantity;
    private String status;
    private String version;

    public String getAvailableQuantity() {
        return this.availableQuantity;
    }

    public void setAvailableQuantity(String availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getReasonCode() {
        return this.reasonCode;
    }

    public void setReasonCode(String reasonCode) {
        this.reasonCode = reasonCode;
    }

    public String getReservedQuantity() {
        return this.reservedQuantity;
    }

    public void setReservedQuantity(String reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
