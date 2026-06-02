package com.sdkwork.clawrouter.app.model;


public class CommerceOrderAddressSnapshotRecord {
    private String addressLine1Encrypted;
    private String capturedAt;
    private String city;
    private String countryCode;
    private String district;
    private String id;
    private String orderId;
    private String organizationId;
    private String phoneMasked;
    private String postalCode;
    private String recipientNameSnapshot;
    private String regionCode;
    private String snapshotVersion;
    private String sourceAddressId;
    private String tenantId;

    public String getAddressLine1Encrypted() {
        return this.addressLine1Encrypted;
    }

    public void setAddressLine1Encrypted(String addressLine1Encrypted) {
        this.addressLine1Encrypted = addressLine1Encrypted;
    }

    public String getCapturedAt() {
        return this.capturedAt;
    }

    public void setCapturedAt(String capturedAt) {
        this.capturedAt = capturedAt;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountryCode() {
        return this.countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getDistrict() {
        return this.district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPhoneMasked() {
        return this.phoneMasked;
    }

    public void setPhoneMasked(String phoneMasked) {
        this.phoneMasked = phoneMasked;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getRecipientNameSnapshot() {
        return this.recipientNameSnapshot;
    }

    public void setRecipientNameSnapshot(String recipientNameSnapshot) {
        this.recipientNameSnapshot = recipientNameSnapshot;
    }

    public String getRegionCode() {
        return this.regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getSnapshotVersion() {
        return this.snapshotVersion;
    }

    public void setSnapshotVersion(String snapshotVersion) {
        this.snapshotVersion = snapshotVersion;
    }

    public String getSourceAddressId() {
        return this.sourceAddressId;
    }

    public void setSourceAddressId(String sourceAddressId) {
        this.sourceAddressId = sourceAddressId;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}
