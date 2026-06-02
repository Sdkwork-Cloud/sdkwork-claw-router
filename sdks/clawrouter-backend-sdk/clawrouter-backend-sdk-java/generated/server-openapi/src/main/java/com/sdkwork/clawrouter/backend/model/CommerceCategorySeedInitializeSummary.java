package com.sdkwork.clawrouter.backend.model;


public class CommerceCategorySeedInitializeSummary {
    private String configKey;
    private String dataset;
    private Boolean installDefaultEnabled;
    private Integer requested;
    private Integer skipped;
    private String targetTable;
    private Integer upserted;

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

    public Integer getRequested() {
        return this.requested;
    }

    public void setRequested(Integer requested) {
        this.requested = requested;
    }

    public Integer getSkipped() {
        return this.skipped;
    }

    public void setSkipped(Integer skipped) {
        this.skipped = skipped;
    }

    public String getTargetTable() {
        return this.targetTable;
    }

    public void setTargetTable(String targetTable) {
        this.targetTable = targetTable;
    }

    public Integer getUpserted() {
        return this.upserted;
    }

    public void setUpserted(Integer upserted) {
        this.upserted = upserted;
    }
}
