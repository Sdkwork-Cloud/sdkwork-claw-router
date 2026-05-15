package com.sdkwork.clawrouter.app.model;

import java.util.List;
import java.util.Map;

public class UpdateRoutingStrategyRequest {
    private List<Map<String, Object>> mappingRules;
    private String strategy;

    public List<Map<String, Object>> getMappingRules() {
        return this.mappingRules;
    }
    
    public void setMappingRules(List<Map<String, Object>> mappingRules) {
        this.mappingRules = mappingRules;
    }

    public String getStrategy() {
        return this.strategy;
    }
    
    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }
}
