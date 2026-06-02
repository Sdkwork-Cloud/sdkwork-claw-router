package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class CommercePaymentRuntimeSnapshotResponse {
    private String environment;
    private List<CommercePaymentRuntimeAssemblyEvent> events;
    private String recordedAt;
    private CommercePaymentRuntimeAssemblySummary summary;

    public String getEnvironment() {
        return this.environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public List<CommercePaymentRuntimeAssemblyEvent> getEvents() {
        return this.events;
    }

    public void setEvents(List<CommercePaymentRuntimeAssemblyEvent> events) {
        this.events = events;
    }

    public String getRecordedAt() {
        return this.recordedAt;
    }

    public void setRecordedAt(String recordedAt) {
        this.recordedAt = recordedAt;
    }

    public CommercePaymentRuntimeAssemblySummary getSummary() {
        return this.summary;
    }

    public void setSummary(CommercePaymentRuntimeAssemblySummary summary) {
        this.summary = summary;
    }
}
