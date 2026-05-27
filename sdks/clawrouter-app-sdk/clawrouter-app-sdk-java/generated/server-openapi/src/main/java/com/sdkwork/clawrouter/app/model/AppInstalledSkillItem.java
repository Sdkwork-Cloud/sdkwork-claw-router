package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class AppInstalledSkillItem {
    private Map<String, String> config;
    private Boolean enabled;
    private String id;
    private String installedAt;
    private String lastEnabledAt;
    private SkillCatalogItem skill;
    private String skillId;

    public Map<String, String> getConfig() {
        return this.config;
    }

    public void setConfig(Map<String, String> config) {
        this.config = config;
    }

    public Boolean getEnabled() {
        return this.enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public SkillCatalogItem getSkill() {
        return this.skill;
    }

    public void setSkill(SkillCatalogItem skill) {
        this.skill = skill;
    }

    public String getSkillId() {
        return this.skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }
}
