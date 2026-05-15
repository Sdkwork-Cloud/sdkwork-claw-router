package com.sdkwork.clawrouter.app.model;

import java.util.Map;

public class SystemInstallationStateRecord {
    private String catalogVersion;
    private String databaseEngine;
    private String environment;
    private String id;
    private String installationId;
    private String installedAt;
    private String lastCheckedAt;
    private Map<String, String> metadata;
    private String schemaVersion;
    private String seedProfile;
    private String status;
    private String upgradedAt;

    public String getCatalogVersion() {
        return this.catalogVersion;
    }
    
    public void setCatalogVersion(String catalogVersion) {
        this.catalogVersion = catalogVersion;
    }

    public String getDatabaseEngine() {
        return this.databaseEngine;
    }
    
    public void setDatabaseEngine(String databaseEngine) {
        this.databaseEngine = databaseEngine;
    }

    public String getEnvironment() {
        return this.environment;
    }
    
    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getInstallationId() {
        return this.installationId;
    }
    
    public void setInstallationId(String installationId) {
        this.installationId = installationId;
    }

    public String getInstalledAt() {
        return this.installedAt;
    }
    
    public void setInstalledAt(String installedAt) {
        this.installedAt = installedAt;
    }

    public String getLastCheckedAt() {
        return this.lastCheckedAt;
    }
    
    public void setLastCheckedAt(String lastCheckedAt) {
        this.lastCheckedAt = lastCheckedAt;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }
    
    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getSchemaVersion() {
        return this.schemaVersion;
    }
    
    public void setSchemaVersion(String schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    public String getSeedProfile() {
        return this.seedProfile;
    }
    
    public void setSeedProfile(String seedProfile) {
        this.seedProfile = seedProfile;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpgradedAt() {
        return this.upgradedAt;
    }
    
    public void setUpgradedAt(String upgradedAt) {
        this.upgradedAt = upgradedAt;
    }
}
