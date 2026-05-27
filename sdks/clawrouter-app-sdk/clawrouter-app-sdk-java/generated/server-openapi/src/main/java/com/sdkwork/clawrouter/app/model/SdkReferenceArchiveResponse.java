package com.sdkwork.clawrouter.app.model;


public class SdkReferenceArchiveResponse {
    private String contentBase64;
    private String contentType;
    private String fileName;
    private String language;

    public String getContentBase64() {
        return this.contentBase64;
    }

    public void setContentBase64(String contentBase64) {
        this.contentBase64 = contentBase64;
    }

    public String getContentType() {
        return this.contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
