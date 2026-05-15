package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class ModelRankingHistoryPoint {
    private String date;
    private List<ModelRankingHistoryEntry> entries;
    private Integer index;

    public String getDate() {
        return this.date;
    }
    
    public void setDate(String date) {
        this.date = date;
    }

    public List<ModelRankingHistoryEntry> getEntries() {
        return this.entries;
    }
    
    public void setEntries(List<ModelRankingHistoryEntry> entries) {
        this.entries = entries;
    }

    public Integer getIndex() {
        return this.index;
    }
    
    public void setIndex(Integer index) {
        this.index = index;
    }
}
