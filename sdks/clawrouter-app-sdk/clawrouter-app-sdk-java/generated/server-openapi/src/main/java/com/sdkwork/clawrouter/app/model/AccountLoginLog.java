package com.sdkwork.clawrouter.app.model;


public class AccountLoginLog {
    private String device;
    private String ip;
    private String location;
    private String status;
    private String time;

    public String getDevice() {
        return this.device;
    }
    
    public void setDevice(String device) {
        this.device = device;
    }

    public String getIp() {
        return this.ip;
    }
    
    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getLocation() {
        return this.location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTime() {
        return this.time;
    }
    
    public void setTime(String time) {
        this.time = time;
    }
}
