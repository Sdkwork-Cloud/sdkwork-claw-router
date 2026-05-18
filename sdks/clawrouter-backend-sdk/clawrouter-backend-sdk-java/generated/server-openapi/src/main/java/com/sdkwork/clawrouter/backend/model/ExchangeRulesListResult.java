package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class ExchangeRulesListResult {
    private String code;
    private List<CommerceExchangeRuleItem> data;
    private String message;
    private String msg;

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public List<CommerceExchangeRuleItem> getData() {
        return this.data;
    }
    
    public void setData(List<CommerceExchangeRuleItem> data) {
        this.data = data;
    }

    public String getMessage() {
        return this.message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }

    public String getMsg() {
        return this.msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
}
