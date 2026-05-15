package com.sdkwork.clawrouter.app.model;


public class CommerceVipDailyRewardStatusResponse {
    private Boolean available;
    private Boolean claimedToday;

    public Boolean getAvailable() {
        return this.available;
    }
    
    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Boolean getClaimedToday() {
        return this.claimedToday;
    }
    
    public void setClaimedToday(Boolean claimedToday) {
        this.claimedToday = claimedToday;
    }
}
