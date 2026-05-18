package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminPaymentAttemptsResponse {
    private List<AdminPaymentAttemptItem> items;

    public List<AdminPaymentAttemptItem> getItems() {
        return this.items;
    }
    
    public void setItems(List<AdminPaymentAttemptItem> items) {
        this.items = items;
    }
}
