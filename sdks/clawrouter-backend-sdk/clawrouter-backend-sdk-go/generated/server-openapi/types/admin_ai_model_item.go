package types

// Persisted ai model snapshot returned by the backend.
type AdminAiModelItem struct {
	ApiFormat string `json:"apiFormat"`
	Calls string `json:"calls"`
	CapabilityIntro string `json:"capabilityIntro"`
	ContextTokens int `json:"contextTokens"`
	Description string `json:"description"`
	Id string `json:"id"`
	InputModalities []string `json:"inputModalities"`
	Limitations []string `json:"limitations"`
	MaxOutputTokens int `json:"maxOutputTokens"`
	Modalities []string `json:"modalities"`
	Name string `json:"name"`
	OutputModalities []string `json:"outputModalities"`
	PriceIn string `json:"priceIn"`
	PriceOut string `json:"priceOut"`
	ReleaseStage int `json:"releaseStage"`
	ReplacementModel string `json:"replacementModel"`
	RoutingState int `json:"routingState"`
	ShelfState int `json:"shelfState"`
	Status string `json:"status"`
	SupportedLanguages []string `json:"supportedLanguages"`
	SupportsJsonSchema bool `json:"supportsJsonSchema"`
	SupportsStreaming bool `json:"supportsStreaming"`
	SupportsTools bool `json:"supportsTools"`
	TrainingDataCutoff string `json:"trainingDataCutoff"`
	Type string `json:"type"`
	UseCases []string `json:"useCases"`
	VendorCode string `json:"vendorCode"`
	VendorId string `json:"vendorId"`
}
