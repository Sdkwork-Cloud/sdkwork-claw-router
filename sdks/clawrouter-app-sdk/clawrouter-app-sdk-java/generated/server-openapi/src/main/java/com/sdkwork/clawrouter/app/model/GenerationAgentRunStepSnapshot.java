package com.sdkwork.clawrouter.app.model;


public class GenerationAgentRunStepSnapshot {
    private String id;
    private Integer index;
    private String status;
    private String title;
    private String type;

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Integer getIndex() {
        return this.index;
    }
    
    public void setIndex(Integer index) {
        this.index = index;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return this.type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
}
