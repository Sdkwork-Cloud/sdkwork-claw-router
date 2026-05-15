package com.sdkwork.clawrouter.app.model;


public class AppReleaseItem {
    private String downloadUrl;
    private String id;
    private String os;
    private String platformType;
    private String releaseDate;
    private String size;
    private String version;
    private String whatsNew;

    public String getDownloadUrl() {
        return this.downloadUrl;
    }
    
    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public String getOs() {
        return this.os;
    }
    
    public void setOs(String os) {
        this.os = os;
    }

    public String getPlatformType() {
        return this.platformType;
    }
    
    public void setPlatformType(String platformType) {
        this.platformType = platformType;
    }

    public String getReleaseDate() {
        return this.releaseDate;
    }
    
    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getSize() {
        return this.size;
    }
    
    public void setSize(String size) {
        this.size = size;
    }

    public String getVersion() {
        return this.version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }

    public String getWhatsNew() {
        return this.whatsNew;
    }
    
    public void setWhatsNew(String whatsNew) {
        this.whatsNew = whatsNew;
    }
}
