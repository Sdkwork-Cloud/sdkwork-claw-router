package com.sdkwork.clawrouter.app.model;


public class CommercePointsBalanceResponse {
    private Integer availablePoints;
    private Integer frozenPoints;

    public Integer getAvailablePoints() {
        return this.availablePoints;
    }
    
    public void setAvailablePoints(Integer availablePoints) {
        this.availablePoints = availablePoints;
    }

    public Integer getFrozenPoints() {
        return this.frozenPoints;
    }
    
    public void setFrozenPoints(Integer frozenPoints) {
        this.frozenPoints = frozenPoints;
    }
}
