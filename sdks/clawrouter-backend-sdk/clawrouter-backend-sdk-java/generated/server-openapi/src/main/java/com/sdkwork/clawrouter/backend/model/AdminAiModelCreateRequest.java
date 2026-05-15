package com.sdkwork.clawrouter.backend.model;

import java.util.List;

public class AdminAiModelCreateRequest {
    private String apiFormat;
    private String capabilityIntro;
    private String contextTokens;
    private String description;
    private List<String> inputModalities;
    private List<String> limitations;
    private Integer maxOutputTokens;
    private List<String> modalities;
    private String name;
    private List<String> outputModalities;
    private String priceIn;
    private String priceOut;
    private Integer releaseStage;
    private String replacementModel;
    private Integer routingState;
    private Integer shelfState;
    private List<String> supportedLanguages;
    private Boolean supportsJsonSchema;
    private Boolean supportsStreaming;
    private Boolean supportsTools;
    private String trainingDataCutoff;
    private String type;
    private List<String> useCases;
    private String vendorId;

    public String getApiFormat() {
        return this.apiFormat;
    }
    
    public void setApiFormat(String apiFormat) {
        this.apiFormat = apiFormat;
    }

    public String getCapabilityIntro() {
        return this.capabilityIntro;
    }
    
    public void setCapabilityIntro(String capabilityIntro) {
        this.capabilityIntro = capabilityIntro;
    }

    public String getContextTokens() {
        return this.contextTokens;
    }
    
    public void setContextTokens(String contextTokens) {
        this.contextTokens = contextTokens;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getInputModalities() {
        return this.inputModalities;
    }
    
    public void setInputModalities(List<String> inputModalities) {
        this.inputModalities = inputModalities;
    }

    public List<String> getLimitations() {
        return this.limitations;
    }
    
    public void setLimitations(List<String> limitations) {
        this.limitations = limitations;
    }

    public Integer getMaxOutputTokens() {
        return this.maxOutputTokens;
    }
    
    public void setMaxOutputTokens(Integer maxOutputTokens) {
        this.maxOutputTokens = maxOutputTokens;
    }

    public List<String> getModalities() {
        return this.modalities;
    }
    
    public void setModalities(List<String> modalities) {
        this.modalities = modalities;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public List<String> getOutputModalities() {
        return this.outputModalities;
    }
    
    public void setOutputModalities(List<String> outputModalities) {
        this.outputModalities = outputModalities;
    }

    public String getPriceIn() {
        return this.priceIn;
    }
    
    public void setPriceIn(String priceIn) {
        this.priceIn = priceIn;
    }

    public String getPriceOut() {
        return this.priceOut;
    }
    
    public void setPriceOut(String priceOut) {
        this.priceOut = priceOut;
    }

    public Integer getReleaseStage() {
        return this.releaseStage;
    }
    
    public void setReleaseStage(Integer releaseStage) {
        this.releaseStage = releaseStage;
    }

    public String getReplacementModel() {
        return this.replacementModel;
    }
    
    public void setReplacementModel(String replacementModel) {
        this.replacementModel = replacementModel;
    }

    public Integer getRoutingState() {
        return this.routingState;
    }
    
    public void setRoutingState(Integer routingState) {
        this.routingState = routingState;
    }

    public Integer getShelfState() {
        return this.shelfState;
    }
    
    public void setShelfState(Integer shelfState) {
        this.shelfState = shelfState;
    }

    public List<String> getSupportedLanguages() {
        return this.supportedLanguages;
    }
    
    public void setSupportedLanguages(List<String> supportedLanguages) {
        this.supportedLanguages = supportedLanguages;
    }

    public Boolean getSupportsJsonSchema() {
        return this.supportsJsonSchema;
    }
    
    public void setSupportsJsonSchema(Boolean supportsJsonSchema) {
        this.supportsJsonSchema = supportsJsonSchema;
    }

    public Boolean getSupportsStreaming() {
        return this.supportsStreaming;
    }
    
    public void setSupportsStreaming(Boolean supportsStreaming) {
        this.supportsStreaming = supportsStreaming;
    }

    public Boolean getSupportsTools() {
        return this.supportsTools;
    }
    
    public void setSupportsTools(Boolean supportsTools) {
        this.supportsTools = supportsTools;
    }

    public String getTrainingDataCutoff() {
        return this.trainingDataCutoff;
    }
    
    public void setTrainingDataCutoff(String trainingDataCutoff) {
        this.trainingDataCutoff = trainingDataCutoff;
    }

    public String getType() {
        return this.type;
    }
    
    public void setType(String type) {
        this.type = type;
    }

    public List<String> getUseCases() {
        return this.useCases;
    }
    
    public void setUseCases(List<String> useCases) {
        this.useCases = useCases;
    }

    public String getVendorId() {
        return this.vendorId;
    }
    
    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }
}
