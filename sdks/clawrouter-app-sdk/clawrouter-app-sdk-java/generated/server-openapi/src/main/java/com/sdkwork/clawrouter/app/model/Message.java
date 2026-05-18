package com.sdkwork.clawrouter.app.model;


public class Message {
    private String content;
    private String desc;
    private String id;
    private Boolean read;
    private Boolean showAsPopup;
    private String time;
    private String title;
    private String type;

    public String getContent() {
        return this.content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }

    public String getDesc() {
        return this.desc;
    }
    
    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Boolean getRead() {
        return this.read;
    }
    
    public void setRead(Boolean read) {
        this.read = read;
    }

    public Boolean getShowAsPopup() {
        return this.showAsPopup;
    }
    
    public void setShowAsPopup(Boolean showAsPopup) {
        this.showAsPopup = showAsPopup;
    }

    public String getTime() {
        return this.time;
    }
    
    public void setTime(String time) {
        this.time = time;
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
