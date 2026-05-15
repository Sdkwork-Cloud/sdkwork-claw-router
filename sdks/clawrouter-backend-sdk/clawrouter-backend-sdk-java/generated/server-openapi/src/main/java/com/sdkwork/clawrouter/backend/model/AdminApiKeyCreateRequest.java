package com.sdkwork.clawrouter.backend.model;


public class AdminApiKeyCreateRequest {
    private String name;
    private Integer userId;

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public Integer getUserId() {
        return this.userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
