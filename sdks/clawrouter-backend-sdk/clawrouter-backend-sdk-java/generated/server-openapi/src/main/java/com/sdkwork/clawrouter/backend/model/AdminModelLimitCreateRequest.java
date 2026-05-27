package com.sdkwork.clawrouter.backend.model;


public class AdminModelLimitCreateRequest {
    private String group;
    private String model;
    private Integer rpm;
    private String status;
    private Integer tpm;

    public String getGroup() {
        return this.group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getRpm() {
        return this.rpm;
    }

    public void setRpm(Integer rpm) {
        this.rpm = rpm;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTpm() {
        return this.tpm;
    }

    public void setTpm(Integer tpm) {
        this.tpm = tpm;
    }
}
