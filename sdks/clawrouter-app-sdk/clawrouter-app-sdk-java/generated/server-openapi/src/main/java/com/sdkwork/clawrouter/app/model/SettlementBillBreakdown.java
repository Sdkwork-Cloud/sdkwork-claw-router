package com.sdkwork.clawrouter.app.model;


public class SettlementBillBreakdown {
    private SettlementBillBreakdownItem audio;
    private SettlementBillBreakdownItem image;
    private SettlementBillBreakdownItem music;
    private SettlementBillBreakdownItem text;
    private SettlementBillBreakdownItem video;

    public SettlementBillBreakdownItem getAudio() {
        return this.audio;
    }
    
    public void setAudio(SettlementBillBreakdownItem audio) {
        this.audio = audio;
    }

    public SettlementBillBreakdownItem getImage() {
        return this.image;
    }
    
    public void setImage(SettlementBillBreakdownItem image) {
        this.image = image;
    }

    public SettlementBillBreakdownItem getMusic() {
        return this.music;
    }
    
    public void setMusic(SettlementBillBreakdownItem music) {
        this.music = music;
    }

    public SettlementBillBreakdownItem getText() {
        return this.text;
    }
    
    public void setText(SettlementBillBreakdownItem text) {
        this.text = text;
    }

    public SettlementBillBreakdownItem getVideo() {
        return this.video;
    }
    
    public void setVideo(SettlementBillBreakdownItem video) {
        this.video = video;
    }
}
