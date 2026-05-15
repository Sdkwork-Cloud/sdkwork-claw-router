package com.sdkwork.clawrouter.app.model;


public class CommerceTokenBalanceResponse {
    private Integer availableTokens;
    private Integer frozenTokens;

    public Integer getAvailableTokens() {
        return this.availableTokens;
    }
    
    public void setAvailableTokens(Integer availableTokens) {
        this.availableTokens = availableTokens;
    }

    public Integer getFrozenTokens() {
        return this.frozenTokens;
    }
    
    public void setFrozenTokens(Integer frozenTokens) {
        this.frozenTokens = frozenTokens;
    }
}
