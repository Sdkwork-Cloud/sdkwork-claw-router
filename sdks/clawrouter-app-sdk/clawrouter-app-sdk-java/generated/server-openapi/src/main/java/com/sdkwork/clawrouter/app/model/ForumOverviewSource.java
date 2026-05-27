package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ForumOverviewSource {
    private String observedAt;
    private String sourceDescription;
    private String sourceLabel;
    private List<String> sourceTables;

    public String getObservedAt() {
        return this.observedAt;
    }

    public void setObservedAt(String observedAt) {
        this.observedAt = observedAt;
    }

    public String getSourceDescription() {
        return this.sourceDescription;
    }

    public void setSourceDescription(String sourceDescription) {
        this.sourceDescription = sourceDescription;
    }

    public String getSourceLabel() {
        return this.sourceLabel;
    }

    public void setSourceLabel(String sourceLabel) {
        this.sourceLabel = sourceLabel;
    }

    public List<String> getSourceTables() {
        return this.sourceTables;
    }

    public void setSourceTables(List<String> sourceTables) {
        this.sourceTables = sourceTables;
    }
}
