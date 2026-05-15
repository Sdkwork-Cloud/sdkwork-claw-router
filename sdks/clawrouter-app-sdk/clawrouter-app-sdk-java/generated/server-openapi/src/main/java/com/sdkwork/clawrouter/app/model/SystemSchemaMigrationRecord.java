package com.sdkwork.clawrouter.app.model;


public class SystemSchemaMigrationRecord {
    private String checksum;
    private String errorMessage;
    private String finishedAt;
    private String id;
    private String migrationKey;
    private String migrationVersion;
    private String startedAt;
    private String status;

    public String getChecksum() {
        return this.checksum;
    }
    
    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getFinishedAt() {
        return this.finishedAt;
    }
    
    public void setFinishedAt(String finishedAt) {
        this.finishedAt = finishedAt;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getMigrationKey() {
        return this.migrationKey;
    }
    
    public void setMigrationKey(String migrationKey) {
        this.migrationKey = migrationKey;
    }

    public String getMigrationVersion() {
        return this.migrationVersion;
    }
    
    public void setMigrationVersion(String migrationVersion) {
        this.migrationVersion = migrationVersion;
    }

    public String getStartedAt() {
        return this.startedAt;
    }
    
    public void setStartedAt(String startedAt) {
        this.startedAt = startedAt;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
