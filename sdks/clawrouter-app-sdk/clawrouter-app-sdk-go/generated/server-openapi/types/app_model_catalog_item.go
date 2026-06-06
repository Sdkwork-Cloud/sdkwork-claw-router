package types

// App model catalog item schema exposed by Claw Router.
type AppModelCatalogItem struct {
	ApiFormat string `json:"apiFormat"`
	Capabilities []string `json:"capabilities"`
	CapabilityIntro string `json:"capabilityIntro"`
	CatalogKey string `json:"catalogKey"`
	Categories []string `json:"categories"`
	ContextTokens string `json:"contextTokens"`
	Description string `json:"description"`
	DisplayName string `json:"displayName"`
	Groups []string `json:"groups"`
	InputModalities []string `json:"inputModalities"`
	Limitations []string `json:"limitations"`
	MaxOutputTokens string `json:"maxOutputTokens"`
	Modalities []string `json:"modalities"`
	Model string `json:"model"`
	OfficialReferencePrices []AppModelCatalogReferencePrice `json:"officialReferencePrices"`
	OutputModalities []string `json:"outputModalities"`
	PriceAvailability AppModelCatalogPriceAvailability `json:"priceAvailability"`
	ProviderCodes []string `json:"providerCodes"`
	ReleaseStage string `json:"releaseStage"`
	ReplacementModel string `json:"replacementModel"`
	RoutingState string `json:"routingState"`
	ShelfState string `json:"shelfState"`
	SupportedLanguages []string `json:"supportedLanguages"`
	SupportsJsonSchema bool `json:"supportsJsonSchema"`
	SupportsStreaming bool `json:"supportsStreaming"`
	SupportsTools bool `json:"supportsTools"`
	TrainingDataCutoff string `json:"trainingDataCutoff"`
	UseCases []string `json:"useCases"`
	Vendor string `json:"vendor"`
	VendorCode string `json:"vendorCode"`
}
