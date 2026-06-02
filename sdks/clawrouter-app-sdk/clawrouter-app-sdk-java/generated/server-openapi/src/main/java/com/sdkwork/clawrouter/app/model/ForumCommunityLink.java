package com.sdkwork.clawrouter.app.model;


public class ForumCommunityLink {
    private String id;
    private String label;
    private MediaResource qrCode;
    private String tone;
    private String url;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return this.label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public MediaResource getQrCode() {
        return this.qrCode;
    }

    public void setQrCode(MediaResource qrCode) {
        this.qrCode = qrCode;
    }

    public String getTone() {
        return this.tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
