package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class GenerationHistoryResponse {
    private List<GenerationHistoryItem> items;

    public List<GenerationHistoryItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<GenerationHistoryItem> items) {
        this.items = items;
    }
}
