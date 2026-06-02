package com.sdkwork.clawrouter.backend.model;

import java.util.Map;

public class AiModelRecord {
    private String apiFormat;
    private Map<String, String> capabilities;
    private String capability;
    private String capabilityIntro;
    private String catalogKey;
    private String colorToken;
    private String contextTokens;
    private String createdAt;
    private String dataScope;
    private String defaultPricingId;
    private String deletedAt;
    private String deletedBy;
    private String deprecatedAt;
    private String description;
    private String displayName;
    private String docsUrl;
    private String familyCode;
    private String familyId;
    private MediaResource icon;
    private String id;
    private Map<String, String> inputModalities;
    private String licenseType;
    private Map<String, String> limitations;
    private Integer maxDurationSeconds;
    private String maxInputTokens;
    private String maxOutputTokens;
    private Map<String, String> metadata;
    private Map<String, String> modalities;
    private String model;
    private Map<String, String> modelAliases;
    private String modelFamily;
    private String modelVersion;
    private String organizationId;
    private Map<String, String> outputModalities;
    private Map<String, String> performanceProfile;
    private String providerHint;
    private String rankScore;
    private String releaseStage;
    private String replacementModel;
    private String retiredAt;
    private String routingState;
    private String shelfState;
    private String status;
    private Map<String, String> supportedLanguages;
    private Boolean supportsJsonSchema;
    private Boolean supportsStreaming;
    private Boolean supportsTools;
    private String tenantId;
    private String trainingDataCutoff;
    private String updatedAt;
    private Map<String, String> useCases;
    private String uuid;
    private String vendorCode;
    private String vendorId;
    private String vendorNameSnapshot;
    private String version;

    public String getApiFormat() {
        return this.apiFormat;
    }

    public void setApiFormat(String apiFormat) {
        this.apiFormat = apiFormat;
    }

    public Map<String, String> getCapabilities() {
        return this.capabilities;
    }

    public void setCapabilities(Map<String, String> capabilities) {
        this.capabilities = capabilities;
    }

    public String getCapability() {
        return this.capability;
    }

    public void setCapability(String capability) {
        this.capability = capability;
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

    public String getColorToken() {
        return this.colorToken;
    }

    public void setColorToken(String colorToken) {
        this.colorToken = colorToken;
    }

    public String getContextTokens() {
        return this.contextTokens;
    }

    public void setContextTokens(String contextTokens) {
        this.contextTokens = contextTokens;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getDataScope() {
        return this.dataScope;
    }

    public void setDataScope(String dataScope) {
        this.dataScope = dataScope;
    }

    public String getDefaultPricingId() {
        return this.defaultPricingId;
    }

    public void setDefaultPricingId(String defaultPricingId) {
        this.defaultPricingId = defaultPricingId;
    }

    public String getDeletedAt() {
        return this.deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getDeletedBy() {
        return this.deletedBy;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public String getDeprecatedAt() {
        return this.deprecatedAt;
    }

    public void setDeprecatedAt(String deprecatedAt) {
        this.deprecatedAt = deprecatedAt;
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

    public String getDocsUrl() {
        return this.docsUrl;
    }

    public void setDocsUrl(String docsUrl) {
        this.docsUrl = docsUrl;
    }

    public String getFamilyCode() {
        return this.familyCode;
    }

    public void setFamilyCode(String familyCode) {
        this.familyCode = familyCode;
    }

    public String getFamilyId() {
        return this.familyId;
    }

    public void setFamilyId(String familyId) {
        this.familyId = familyId;
    }

    public MediaResource getIcon() {
        return this.icon;
    }

    public void setIcon(MediaResource icon) {
        this.icon = icon;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getInputModalities() {
        return this.inputModalities;
    }

    public void setInputModalities(Map<String, String> inputModalities) {
        this.inputModalities = inputModalities;
    }

    public String getLicenseType() {
        return this.licenseType;
    }

    public void setLicenseType(String licenseType) {
        this.licenseType = licenseType;
    }

    public Map<String, String> getLimitations() {
        return this.limitations;
    }

    public void setLimitations(Map<String, String> limitations) {
        this.limitations = limitations;
    }

    public Integer getMaxDurationSeconds() {
        return this.maxDurationSeconds;
    }

    public void setMaxDurationSeconds(Integer maxDurationSeconds) {
        this.maxDurationSeconds = maxDurationSeconds;
    }

    public String getMaxInputTokens() {
        return this.maxInputTokens;
    }

    public void setMaxInputTokens(String maxInputTokens) {
        this.maxInputTokens = maxInputTokens;
    }

    public String getMaxOutputTokens() {
        return this.maxOutputTokens;
    }

    public void setMaxOutputTokens(String maxOutputTokens) {
        this.maxOutputTokens = maxOutputTokens;
    }

    public Map<String, String> getMetadata() {
        return this.metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public Map<String, String> getModalities() {
        return this.modalities;
    }

    public void setModalities(Map<String, String> modalities) {
        this.modalities = modalities;
    }

    public String getModel() {
        return this.model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Map<String, String> getModelAliases() {
        return this.modelAliases;
    }

    public void setModelAliases(Map<String, String> modelAliases) {
        this.modelAliases = modelAliases;
    }

    public String getModelFamily() {
        return this.modelFamily;
    }

    public void setModelFamily(String modelFamily) {
        this.modelFamily = modelFamily;
    }

    public String getModelVersion() {
        return this.modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public String getOrganizationId() {
        return this.organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public Map<String, String> getOutputModalities() {
        return this.outputModalities;
    }

    public void setOutputModalities(Map<String, String> outputModalities) {
        this.outputModalities = outputModalities;
    }

    public Map<String, String> getPerformanceProfile() {
        return this.performanceProfile;
    }

    public void setPerformanceProfile(Map<String, String> performanceProfile) {
        this.performanceProfile = performanceProfile;
    }

    public String getProviderHint() {
        return this.providerHint;
    }

    public void setProviderHint(String providerHint) {
        this.providerHint = providerHint;
    }

    public String getRankScore() {
        return this.rankScore;
    }

    public void setRankScore(String rankScore) {
        this.rankScore = rankScore;
    }

    public String getReleaseStage() {
        return this.releaseStage;
    }

    public void setReleaseStage(String releaseStage) {
        this.releaseStage = releaseStage;
    }

    public String getReplacementModel() {
        return this.replacementModel;
    }

    public void setReplacementModel(String replacementModel) {
        this.replacementModel = replacementModel;
    }

    public String getRetiredAt() {
        return this.retiredAt;
    }

    public void setRetiredAt(String retiredAt) {
        this.retiredAt = retiredAt;
    }

    public String getRoutingState() {
        return this.routingState;
    }

    public void setRoutingState(String routingState) {
        this.routingState = routingState;
    }

    public String getShelfState() {
        return this.shelfState;
    }

    public void setShelfState(String shelfState) {
        this.shelfState = shelfState;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, String> getSupportedLanguages() {
        return this.supportedLanguages;
    }

    public void setSupportedLanguages(Map<String, String> supportedLanguages) {
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

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTrainingDataCutoff() {
        return this.trainingDataCutoff;
    }

    public void setTrainingDataCutoff(String trainingDataCutoff) {
        this.trainingDataCutoff = trainingDataCutoff;
    }

    public String getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Map<String, String> getUseCases() {
        return this.useCases;
    }

    public void setUseCases(Map<String, String> useCases) {
        this.useCases = useCases;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getVendorCode() {
        return this.vendorCode;
    }

    public void setVendorCode(String vendorCode) {
        this.vendorCode = vendorCode;
    }

    public String getVendorId() {
        return this.vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorNameSnapshot() {
        return this.vendorNameSnapshot;
    }

    public void setVendorNameSnapshot(String vendorNameSnapshot) {
        this.vendorNameSnapshot = vendorNameSnapshot;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
