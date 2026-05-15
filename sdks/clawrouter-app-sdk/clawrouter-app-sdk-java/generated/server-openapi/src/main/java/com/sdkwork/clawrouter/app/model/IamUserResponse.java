package com.sdkwork.clawrouter.app.model;


public class IamUserResponse {
    private String avatarUrl;
    private String displayName;
    private String email;
    private String id;
    private Boolean isVerified;
    private String language;
    private String lastLogin;
    private String lastLoginIp;
    private String passwordLastChanged;
    private String phone;
    private String registeredAt;
    private String status;
    private String thirdPartyBound;
    private Boolean twoFactorEnabled;
    private String username;

    public String getAvatarUrl() {
        return this.avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getDisplayName() {
        return this.displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
        this.id = id;
    }

    public Boolean getIsVerified() {
        return this.isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getLanguage() {
        return this.language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLastLogin() {
        return this.lastLogin;
    }
    
    public void setLastLogin(String lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getLastLoginIp() {
        return this.lastLoginIp;
    }
    
    public void setLastLoginIp(String lastLoginIp) {
        this.lastLoginIp = lastLoginIp;
    }

    public String getPasswordLastChanged() {
        return this.passwordLastChanged;
    }
    
    public void setPasswordLastChanged(String passwordLastChanged) {
        this.passwordLastChanged = passwordLastChanged;
    }

    public String getPhone() {
        return this.phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRegisteredAt() {
        return this.registeredAt;
    }
    
    public void setRegisteredAt(String registeredAt) {
        this.registeredAt = registeredAt;
    }

    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getThirdPartyBound() {
        return this.thirdPartyBound;
    }
    
    public void setThirdPartyBound(String thirdPartyBound) {
        this.thirdPartyBound = thirdPartyBound;
    }

    public Boolean getTwoFactorEnabled() {
        return this.twoFactorEnabled;
    }
    
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public String getUsername() {
        return this.username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}
