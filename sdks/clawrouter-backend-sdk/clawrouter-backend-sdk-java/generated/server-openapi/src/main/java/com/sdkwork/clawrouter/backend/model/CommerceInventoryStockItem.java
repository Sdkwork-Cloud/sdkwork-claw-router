package com.sdkwork.clawrouter.backend.model;


public class CommerceInventoryStockItem {
    private String availableQuantity;
    private String createdAt;
    private String id;
    private String reservedQuantity;
    private String skuId;
    private String soldQuantity;
    private String status;
    private String updatedAt;
    private String version;
    private String warehouseId;

    public String getAvailableQuantity() {
        return this.availableQuantity;
    }

    public void setAvailableQuantity(String availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReservedQuantity() {
        return this.reservedQuantity;
    }

    public void setReservedQuantity(String reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public String getSkuId() {
        return this.skuId;
    }

    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }

    public String getSoldQuantity() {
        return this.soldQuantity;
    }

    public void setSoldQuantity(String soldQuantity) {
        this.soldQuantity = soldQuantity;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getWarehouseId() {
        return this.warehouseId;
    }

    public void setWarehouseId(String warehouseId) {
        this.warehouseId = warehouseId;
    }
}
