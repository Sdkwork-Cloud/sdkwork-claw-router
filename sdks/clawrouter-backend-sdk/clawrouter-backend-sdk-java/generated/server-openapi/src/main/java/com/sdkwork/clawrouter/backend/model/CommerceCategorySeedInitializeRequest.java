package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommerceCategorySeedInitializeRequest {
    private List<String> datasets;
    private String mode;

    public List<String> getDatasets() {
        return this.datasets;
    }

    public void setDatasets(List<String> datasets) {
        this.datasets = datasets;
    }

    public String getMode() {
        return this.mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
