package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class CommerceStandardCommandRequest {
    private String clientRequestNo;
    private Map<String, String> metadata;
    private String note;

    public String getClientRequestNo() {
        return this.clientRequestNo;
    }

    public void setClientRequestNo(String clientRequestNo) {
        this.clientRequestNo = clientRequestNo;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getNote() {
        return this.note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
