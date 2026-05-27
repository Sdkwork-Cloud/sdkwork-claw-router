package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminModelCatalogSyncResponse {
    private Integer acceptedCount;
    private Integer capabilityCount;
    private String catalogRoot;
    private String catalogVersion;
    private Boolean dryRun;
    private Integer familyCount;
    private Integer meterCount;
    private String mode;
    private Integer modelCount;
    private List<AdminAiModelItem> models;
    private Integer priceCount;
    private Integer rankingCount;
    private String requestedCatalogVersion;
    private String snapshotId;
    private String source;
    private String sourceHash;
    private String syncRunId;
    private Boolean synced;
    private List<String> vendorCodes;
    private Integer vendorCount;
    private List<AdminModelVendorItem> vendors;

    public Integer getAcceptedCount() {
        return this.acceptedCount;
    }

    public void setAcceptedCount(Integer acceptedCount) {
        this.acceptedCount = acceptedCount;
    }

    public Integer getCapabilityCount() {
        return this.capabilityCount;
    }

    public void setCapabilityCount(Integer capabilityCount) {
        this.capabilityCount = capabilityCount;
    }

    public String getCatalogRoot() {
        return this.catalogRoot;
    }

    public void setCatalogRoot(String catalogRoot) {
        this.catalogRoot = catalogRoot;
    }

    public String getCatalogVersion() {
        return this.catalogVersion;
    }

    public void setCatalogVersion(String catalogVersion) {
        this.catalogVersion = catalogVersion;
    }

    public Boolean getDryRun() {
        return this.dryRun;
    }

    public void setDryRun(Boolean dryRun) {
        this.dryRun = dryRun;
    }

    public Integer getFamilyCount() {
        return this.familyCount;
    }

    public void setFamilyCount(Integer familyCount) {
        this.familyCount = familyCount;
    }

    public Integer getMeterCount() {
        return this.meterCount;
    }

    public void setMeterCount(Integer meterCount) {
        this.meterCount = meterCount;
    }

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Integer getModelCount() {
        return this.modelCount;
    }

    public void setModelCount(Integer modelCount) {
        this.modelCount = modelCount;
    }

    public List<AdminAiModelItem> getModels() {
        return this.models;
    }

    public void setModels(List<AdminAiModelItem> models) {
        this.models = models;
    }

    public Integer getPriceCount() {
        return this.priceCount;
    }

    public void setPriceCount(Integer priceCount) {
        this.priceCount = priceCount;
    }

    public Integer getRankingCount() {
        return this.rankingCount;
    }

    public void setRankingCount(Integer rankingCount) {
        this.rankingCount = rankingCount;
    }

    public String getRequestedCatalogVersion() {
        return this.requestedCatalogVersion;
    }

    public void setRequestedCatalogVersion(String requestedCatalogVersion) {
        this.requestedCatalogVersion = requestedCatalogVersion;
    }

    public String getSnapshotId() {
        return this.snapshotId;
    }

    public void setSnapshotId(String snapshotId) {
        this.snapshotId = snapshotId;
    }

    public String getSource() {
        return this.source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourceHash() {
        return this.sourceHash;
    }

    public void setSourceHash(String sourceHash) {
        this.sourceHash = sourceHash;
    }

    public String getSyncRunId() {
        return this.syncRunId;
    }

    public void setSyncRunId(String syncRunId) {
        this.syncRunId = syncRunId;
    }

    public Boolean getSynced() {
        return this.synced;
    }

    public void setSynced(Boolean synced) {
        this.synced = synced;
    }

    public List<String> getVendorCodes() {
        return this.vendorCodes;
    }

    public void setVendorCodes(List<String> vendorCodes) {
        this.vendorCodes = vendorCodes;
    }

    public Integer getVendorCount() {
        return this.vendorCount;
    }

    public void setVendorCount(Integer vendorCount) {
        this.vendorCount = vendorCount;
    }

    public List<AdminModelVendorItem> getVendors() {
        return this.vendors;
    }

    public void setVendors(List<AdminModelVendorItem> vendors) {
        this.vendors = vendors;
    }
}
