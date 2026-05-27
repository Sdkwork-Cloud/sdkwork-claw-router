package com.sdkwork.clawrouter.backend.model;


public class PlusUserAgentSkillRecord {
    private String installedAt;
    private String lastEnabledAt;
    private String lastUsedAt;

    public String getInstalledAt() {
        return this.installedAt;
    }

    public void setInstalledAt(String installedAt) {
        this.installedAt = installedAt;
    }

    public String getLastEnabledAt() {
        return this.lastEnabledAt;
    }

    public void setLastEnabledAt(String lastEnabledAt) {
        this.lastEnabledAt = lastEnabledAt;
    }

    public String getLastUsedAt() {
        return this.lastUsedAt;
    }

    public void setLastUsedAt(String lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }
}
