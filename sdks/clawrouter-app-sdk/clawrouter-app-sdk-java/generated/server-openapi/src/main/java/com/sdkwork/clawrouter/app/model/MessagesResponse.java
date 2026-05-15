package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class MessagesResponse {
    private List<Message> items;

    public List<Message> getItems() {
        return this.items;
    }
    
    public void setItems(List<Message> items) {
        this.items = items;
    }
}
