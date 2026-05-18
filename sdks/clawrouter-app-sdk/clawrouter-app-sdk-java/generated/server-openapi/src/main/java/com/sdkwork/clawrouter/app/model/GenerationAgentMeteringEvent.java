package com.sdkwork.clawrouter.app.model;


public class GenerationAgentMeteringEvent {
    private String quantity;
    private String type;
    private GenerationAgentUsageFactMetadata usageFactMetadata;

    public String getQuantity() {
        return this.quantity;
    }
    
    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getType() {
        return this.type;
    }
    
    public void setType(String type) {
        this.type = type;
    }

    public GenerationAgentUsageFactMetadata getUsageFactMetadata() {
        return this.usageFactMetadata;
    }
    
    public void setUsageFactMetadata(GenerationAgentUsageFactMetadata usageFactMetadata) {
        this.usageFactMetadata = usageFactMetadata;
    }
}
