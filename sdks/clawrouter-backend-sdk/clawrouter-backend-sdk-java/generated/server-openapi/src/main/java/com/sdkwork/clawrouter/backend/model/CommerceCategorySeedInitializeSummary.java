package com.sdkwork.clawrouter.backend.model;


public class CommerceCategorySeedInitializeSummary {
    private String configKey;
    private String dataset;
    private Boolean installDefaultEnabled;
    private String requested;
    private String skipped;
    private String targetTable;
    private String upserted;

    public String getConfigKey() {
        return this.configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getDataset() {
        return this.dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public Boolean getInstallDefaultEnabled() {
        return this.installDefaultEnabled;
    }

    public void setInstallDefaultEnabled(Boolean installDefaultEnabled) {
        this.installDefaultEnabled = installDefaultEnabled;
    }

    public String getRequested() {
        return this.requested;
    }

    public void setRequested(String requested) {
        this.requested = requested;
    }

    public String getSkipped() {
        return this.skipped;
    }

    public void setSkipped(String skipped) {
        this.skipped = skipped;
    }

    public String getTargetTable() {
        return this.targetTable;
    }

    public void setTargetTable(String targetTable) {
        this.targetTable = targetTable;
    }

    public String getUpserted() {
        return this.upserted;
    }

    public void setUpserted(String upserted) {
        this.upserted = upserted;
    }
}
