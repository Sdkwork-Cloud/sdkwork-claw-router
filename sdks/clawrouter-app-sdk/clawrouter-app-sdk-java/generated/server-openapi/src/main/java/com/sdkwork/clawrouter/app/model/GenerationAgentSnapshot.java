package com.sdkwork.clawrouter.app.model;


public class GenerationAgentSnapshot {
    private String id;
    private String model;
    private String name;
    private String versionId;

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getModel() {
        return this.model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getVersionId() {
        return this.versionId;
    }
    
    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }
}
