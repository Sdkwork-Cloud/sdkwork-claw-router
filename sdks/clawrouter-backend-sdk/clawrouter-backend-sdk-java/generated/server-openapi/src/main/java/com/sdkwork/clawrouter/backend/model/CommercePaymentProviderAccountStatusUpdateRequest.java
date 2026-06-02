package com.sdkwork.clawrouter.backend.model;


public class CommercePaymentProviderAccountStatusUpdateRequest {
    private String clientRequestNo;
    private String note;
    private String status;

    public String getClientRequestNo() {
        return this.clientRequestNo;
    }

    public void setClientRequestNo(String clientRequestNo) {
        this.clientRequestNo = clientRequestNo;
    }

    public String getNote() {
        return this.note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
