package types

// App model catalog item schema exposed by Claw Router.
type AppModelCatalogItem struct {
	ApiFormat string `json:"apiFormat"`
	Capabilities []string `json:"capabilities"`
	CapabilityIntro string `json:"capabilityIntro"`
	CatalogKey string `json:"catalogKey"`
	Categories []string `json:"categories"`
	ContextTokens int `json:"contextTokens"`
	Description string `json:"description"`
	DisplayName string `json:"displayName"`
	Groups []string `json:"groups"`
	InputModalities []string `json:"inputModalities"`
	Limitations []string `json:"limitations"`
	MaxOutputTokens int `json:"maxOutputTokens"`
	Modalities []string `json:"modalities"`
	Model string `json:"model"`
	OfficialReferenceCurrency string `json:"officialReferenceCurrency"`
	OfficialReferencePrices []AppModelCatalogReferencePrice `json:"officialReferencePrices"`
	OfficialReferenceUnitPrice string `json:"officialReferenceUnitPrice"`
	OutputModalities []string `json:"outputModalities"`
	PriceAvailability AppModelCatalogPriceAvailability `json:"priceAvailability"`
	ProviderCodes []string `json:"providerCodes"`
	RegionCode string `json:"regionCode"`
	ReleaseStage int `json:"releaseStage"`
	ReplacementModel string `json:"replacementModel"`
	RoutingState int `json:"routingState"`
	ShelfState int `json:"shelfState"`
	SupportedLanguages []string `json:"supportedLanguages"`
	SupportsJsonSchema bool `json:"supportsJsonSchema"`
	SupportsStreaming bool `json:"supportsStreaming"`
	SupportsTools bool `json:"supportsTools"`
	TrainingDataCutoff string `json:"trainingDataCutoff"`
	UseCases []string `json:"useCases"`
	Vendor string `json:"vendor"`
	VendorCode string `json:"vendorCode"`
}
