package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class AppModelCatalogItem {
    private String apiFormat;
    private List<String> capabilities;
    private String capabilityIntro;
    private String catalogKey;
    private List<String> categories;
    private Integer contextTokens;
    private String description;
    private String displayName;
    private List<String> groups;
    private List<String> inputModalities;
    private List<String> limitations;
    private Integer maxOutputTokens;
    private List<String> modalities;
    private String model;
    private String officialReferenceCurrency;
    private List<AppModelCatalogReferencePrice> officialReferencePrices;
    private String officialReferenceUnitPrice;
    private List<String> outputModalities;
    private AppModelCatalogPriceAvailability priceAvailability;
    private List<String> providerCodes;
    private String regionCode;
    private Integer releaseStage;
    private String replacementModel;
    private Integer routingState;
    private Integer shelfState;
    private List<String> supportedLanguages;
    private Boolean supportsJsonSchema;
    private Boolean supportsStreaming;
    private Boolean supportsTools;
    private String trainingDataCutoff;
    private List<String> useCases;
    private String vendor;
    private String vendorCode;

    public String getApiFormat() {
        return this.apiFormat;
    }
    
    public void setApiFormat(String apiFormat) {
        this.apiFormat = apiFormat;
    }

    public List<String> getCapabilities() {
        return this.capabilities;
    }
    
    public void setCapabilities(List<String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getCapabilityIntro() {
        return this.capabilityIntro;
    }
    
    public void setCapabilityIntro(String capabilityIntro) {
        this.capabilityIntro = capabilityIntro;
    }

    public String getCatalogKey() {
        return this.catalogKey;
    }
    
    public void setCatalogKey(String catalogKey) {
        this.catalogKey = catalogKey;
    }

    public List<String> getCategories() {
        return this.categories;
    }
    
    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public Integer getContextTokens() {
        return this.contextTokens;
    }
    
    public void setContextTokens(Integer contextTokens) {
        this.contextTokens = contextTokens;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getDisplayName() {
        return this.displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public List<String> getGroups() {
        return this.groups;
    }
    
    public void setGroups(List<String> groups) {
        this.groups = groups;
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

    public String getModel() {
        return this.model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }

    public String getOfficialReferenceCurrency() {
        return this.officialReferenceCurrency;
    }
    
    public void setOfficialReferenceCurrency(String officialReferenceCurrency) {
        this.officialReferenceCurrency = officialReferenceCurrency;
    }

    public List<AppModelCatalogReferencePrice> getOfficialReferencePrices() {
        return this.officialReferencePrices;
    }
    
    public void setOfficialReferencePrices(List<AppModelCatalogReferencePrice> officialReferencePrices) {
        this.officialReferencePrices = officialReferencePrices;
    }

    public String getOfficialReferenceUnitPrice() {
        return this.officialReferenceUnitPrice;
    }
    
    public void setOfficialReferenceUnitPrice(String officialReferenceUnitPrice) {
        this.officialReferenceUnitPrice = officialReferenceUnitPrice;
    }

    public List<String> getOutputModalities() {
        return this.outputModalities;
    }
    
    public void setOutputModalities(List<String> outputModalities) {
        this.outputModalities = outputModalities;
    }

    public AppModelCatalogPriceAvailability getPriceAvailability() {
        return this.priceAvailability;
    }
    
    public void setPriceAvailability(AppModelCatalogPriceAvailability priceAvailability) {
        this.priceAvailability = priceAvailability;
    }

    public List<String> getProviderCodes() {
        return this.providerCodes;
    }
    
    public void setProviderCodes(List<String> providerCodes) {
        this.providerCodes = providerCodes;
    }

    public String getRegionCode() {
        return this.regionCode;
    }
    
    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
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

    public List<String> getUseCases() {
        return this.useCases;
    }
    
    public void setUseCases(List<String> useCases) {
        this.useCases = useCases;
    }

    public String getVendor() {
        return this.vendor;
    }
    
    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public String getVendorCode() {
        return this.vendorCode;
    }
    
    public void setVendorCode(String vendorCode) {
        this.vendorCode = vendorCode;
    }
}
