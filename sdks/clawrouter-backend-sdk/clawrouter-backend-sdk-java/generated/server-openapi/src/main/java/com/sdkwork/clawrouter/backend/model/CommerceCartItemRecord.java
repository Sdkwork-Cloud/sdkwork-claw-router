package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class CommerceCartItemRecord {
    private String cartId;
    private String createdAt;
    private String id;
    private Map<String, String> metadataJson;
    private String organizationId;
    private Map<String, String> priceSnapshotJson;
    private String quantity;
    private Boolean selected;
    private String skuId;
    private String tenantId;
    private String updatedAt;

    public String getCartId() {
        return this.cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
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

    public Map<String, String> getMetadataJson() {
        return this.metadataJson;
    }

    public void setMetadataJson(Map<String, String> metadataJson) {
        this.metadataJson = metadataJson;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getPriceSnapshotJson() {
        return this.priceSnapshotJson;
    }

    public void setPriceSnapshotJson(Map<String, String> priceSnapshotJson) {
        this.priceSnapshotJson = priceSnapshotJson;
    }

    public String getQuantity() {
        return this.quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public Boolean getSelected() {
        return this.selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }

    public String getSkuId() {
        return this.skuId;
    }

    public void setSkuId(String skuId) {
        this.skuId = skuId;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
